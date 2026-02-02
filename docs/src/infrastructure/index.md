# Infrastructure

> Designing for resilience, security, and scale.

This section documents how we deploy and operate the Toast restaurant ordering system across multiple cloud regions.

---

## At a Glance

| Aspect | Our Solution |
|--------|--------------|
| **Compute** | AWS EC2 with NixOS |
| **Networking** | Tailscale mesh (self-hosted via Headscale) |
| **Database** | Citus (distributed PostgreSQL) |
| **Ingress** | nginx reverse proxy |
| **Deployment** | NixOS modules + deploy-rs |

---

## Documentation

- [**Architecture**](./architecture.md) — Complete system design with diagrams and explanations
