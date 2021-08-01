data aws_route53_zone "zone" {
  name = "umbreon.lol"
}

resource aws_route53_record "record" {
  zone_id = data.aws_route53_zone.zone.zone_id
  name = "umbreon.lol"
  type = "A"

  alias {
    evaluate_target_health = true
    name = aws_alb.application_load_balancer.dns_name
    zone_id = aws_alb.application_load_balancer.zone_id
  }
}

resource aws_route53_record "validation" {
  zone_id = data.aws_route53_zone.zone.zone_id
  name = "_c49a43ef075dd3cb219716c91a137f44.umbreon.lol."
  type = "CNAME"
  ttl = 300
  records = ["_45dd986bacc791e60b12133451285cff.qqqfmgwtgn.acm-validations.aws."]
}

resource "aws_acm_certificate" "default" {
  domain_name = "umbreon.lol"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "default" {
  certificate_arn = "${aws_acm_certificate.default.arn}"
  validation_record_fqdns = [
    "${aws_route53_record.validation.fqdn}",
  ]
}
