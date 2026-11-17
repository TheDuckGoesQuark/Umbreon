use std::{
    path::Path,
    sync::{Arc, Mutex},
    time::{SystemTime, UNIX_EPOCH},
};

use rusqlite::{params, Connection, OptionalExtension};
use sha2::{Digest, Sha256};

#[derive(Clone)]
pub struct Store {
    connection: Arc<Mutex<Connection>>,
}

pub struct Device {
    pub id: String,
    pub name: String,
    pub last_seen_ms: Option<i64>,
}

impl Store {
    pub fn open(path: &Path) -> rusqlite::Result<Self> {
        let connection = Connection::open(path)?;
        connection.execute_batch(
            "CREATE TABLE IF NOT EXISTS devices (
                id TEXT PRIMARY KEY,
                owner TEXT NOT NULL,
                name TEXT NOT NULL,
                token_hash TEXT NOT NULL,
                last_seen_ms INTEGER
            );
            CREATE INDEX IF NOT EXISTS devices_owner ON devices (owner);",
        )?;
        Ok(Self {
            connection: Arc::new(Mutex::new(connection)),
        })
    }

    /// Returns the device and its token. Only the token's hash is stored, so
    /// this is the one chance to hand it to the user.
    pub fn create(&self, owner: &str, name: &str) -> rusqlite::Result<(Device, String)> {
        let id = random_hex(8);
        let token = random_hex(32);
        self.connection.lock().unwrap().execute(
            "INSERT INTO devices (id, owner, name, token_hash) VALUES (?1, ?2, ?3, ?4)",
            params![id, owner, name, hash(&token)],
        )?;
        let device = Device {
            id,
            name: name.to_owned(),
            last_seen_ms: None,
        };
        Ok((device, token))
    }

    pub fn list(&self, owner: &str) -> rusqlite::Result<Vec<Device>> {
        let connection = self.connection.lock().unwrap();
        let mut statement = connection.prepare(
            "SELECT id, name, last_seen_ms FROM devices WHERE owner = ?1 ORDER BY name, id",
        )?;
        let devices = statement
            .query_map([owner], |row| {
                Ok(Device {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    last_seen_ms: row.get(2)?,
                })
            })?
            .collect();
        devices
    }

    pub fn is_owner(&self, owner: &str, device_id: &str) -> bool {
        self.connection
            .lock()
            .unwrap()
            .query_row(
                "SELECT 1 FROM devices WHERE id = ?1 AND owner = ?2",
                [device_id, owner],
                |_| Ok(()),
            )
            .optional()
            .is_ok_and(|found| found.is_some())
    }

    pub fn token_matches(&self, device_id: &str, token: &str) -> bool {
        self.connection
            .lock()
            .unwrap()
            .query_row(
                "SELECT 1 FROM devices WHERE id = ?1 AND token_hash = ?2",
                [device_id, hash(token).as_str()],
                |_| Ok(()),
            )
            .optional()
            .is_ok_and(|found| found.is_some())
    }

    pub fn delete(&self, owner: &str, device_id: &str) -> bool {
        self.connection
            .lock()
            .unwrap()
            .execute(
                "DELETE FROM devices WHERE id = ?1 AND owner = ?2",
                [device_id, owner],
            )
            .is_ok_and(|deleted| deleted > 0)
    }

    pub fn mark_seen(&self, device_id: &str) {
        let now_ms = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|elapsed| elapsed.as_millis() as i64)
            .unwrap_or(0);
        let result = self.connection.lock().unwrap().execute(
            "UPDATE devices SET last_seen_ms = ?1 WHERE id = ?2",
            params![now_ms, device_id],
        );
        if let Err(error) = result {
            tracing::warn!(device_id, %error, "failed to record last seen");
        }
    }
}

pub fn random_hex(bytes: usize) -> String {
    let mut buffer = vec![0u8; bytes];
    getrandom::fill(&mut buffer).expect("operating system random source");
    hex::encode(buffer)
}

fn hash(token: &str) -> String {
    hex::encode(Sha256::digest(token.as_bytes()))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn store() -> Store {
        Store::open(Path::new(":memory:")).unwrap()
    }

    #[test]
    fn token_only_matches_its_own_device() {
        let store = store();
        let (first, first_token) = store.create("alice", "one").unwrap();
        let (second, _) = store.create("alice", "two").unwrap();

        assert!(store.token_matches(&first.id, &first_token));
        assert!(!store.token_matches(&second.id, &first_token));
        assert!(!store.token_matches(&first.id, "wrong"));
    }

    #[test]
    fn users_see_and_delete_only_their_own_devices() {
        let store = store();
        let (device, _) = store.create("alice", "one").unwrap();

        assert!(store.list("bob").unwrap().is_empty());
        assert!(!store.is_owner("bob", &device.id));
        assert!(!store.delete("bob", &device.id));
        assert!(store.is_owner("alice", &device.id));
        assert!(store.delete("alice", &device.id));
        assert!(store.list("alice").unwrap().is_empty());
    }
}
