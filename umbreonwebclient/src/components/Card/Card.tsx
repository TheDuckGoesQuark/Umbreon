import "./card.scss"

interface CardProps {
    imgSrc: string,
    imgAlt: string,
}

const Card = ({imgSrc, imgAlt}:CardProps) => {
    return <div className="card">
        <img src={imgSrc} alt={imgAlt} className="card-img" />
        hello
    </div>
}

export default Card;