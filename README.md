# Toast | Multi-region restaurant ordering

A Trinity College Dublin software engineering project mentored by Toast. A diner can browse Dublin restaurants, choose a meal, and review a cart. The team designed the ordering service for multiple regions and deployed seven Google Cloud VMs across two zones to demonstrate the architecture.

[Full backend failover demo · 3:08](#backend-failover-demo) · [Frontend tour · 0:09](#frontend-demo) · [Architecture](#system-architecture) · [REST API](#rest-api) · [Team](#team-and-contributions) · [Run locally](#run-locally)

**Dev Joshi’s contribution** · distributed PostgreSQL, database credential handling, and monitoring on NixOS. [See the implementation and team credits](#team-and-contributions).

## Backend failover demo

[Watch or download the full recording (MP4, 3:08)](docs/media/backend-failover.mp4?raw=1)

The team sends repeated requests through nginx and checks which backend answers. Around **1:00**, the terminal shows responses from both hosts. Around **2:00**, after a backend service is stopped, the ingress health check still reports `UP`. The next server-info request identifies the backend serving traffic.

## Frontend demo

[![Restaurant browser showing cuisine filters and Dublin restaurant cards](docs/media/restaurants.png)](docs/media/frontend-demo.webm)

The recording follows one order through the React UI. Search for **Luna**, open **Luna Pasta Bar**, add a menu item, and review the cart total. The catalogue uses sample data and the cart runs in browser state. The backend contract and its tests are linked below.

## System architecture

[![Multi-region design showing the client, edge, nginx ingress, regional backends, distributed database, and monitoring](docs/media/backend-architecture.png)](docs/media/backend-architecture.png)

*The team’s design uses Dublin and London to illustrate how traffic could move between regions.*

nginx forwards traffic to either Spring Boot backend and can retry another upstream on a timeout or selected errors. Both backends connect to the PostgreSQL **Citus coordinator**, which routes distributed queries to the workers. The separate monitoring node runs Prometheus, Grafana, and Loki.

### Google Cloud deployment

The Compute Engine snapshot shows **seven running VMs** in one region. The team placed one backend and one database worker in each of `us-central1-a` and `us-central1-b`. The coordinator, ingress, and monitoring nodes ran in zone A.

![Compute Engine snapshot showing VM names, running status, and zones](docs/media/gcp-nodes.png)

The checked-in NixOS fleet configuration uses EC2 defaults. [Node definitions](nix/nodes.nix) · [Ingress retry policy](nix/nixos-modules/nginx-ingress.nix) · [Architecture notes](docs/src/infrastructure/architecture.md)

## REST API

The OpenAPI contract groups 14 operations into three areas. The local API root is `http://localhost:8080/api`.

The sequence diagram follows a customer from registration through order creation, then shows how staff retrieve pending orders and update their status.

![REST API sequence from customer login and order creation to staff status updates](docs/media/order-sequence.png)

<details>
<summary>View the OpenAPI file rendered in Swagger Editor</summary>


[![Swagger Editor rendering of the Restaurant Ordering API specification](docs/media/openapi.png)](https://editor.swagger.io/?url=https%3A%2F%2Fraw.githubusercontent.com%2FDevEnjoysMath%2Fmulti-region-cloud-system%2Fmain%2Fspecs%2Fopenapi.yaml)

</details>

[Explore the rendered OpenAPI reference](https://editor.swagger.io/?url=https%3A%2F%2Fraw.githubusercontent.com%2FDevEnjoysMath%2Fmulti-region-cloud-system%2Fmain%2Fspecs%2Fopenapi.yaml) · [Read the YAML](specs/openapi.yaml) · [See how Schemathesis exercises the contract against Spring Boot](nix/checks/health.nix)

## Team and contributions

**Dev Joshi · Cloud & DevOps Engineer.** Dev contributed the distributed PostgreSQL configuration and architecture notes, integrated encrypted database credentials into service startup, and added a monitoring VM test that starts Prometheus, Grafana, and Loki together. [Database module](nix/nixos-modules/postgres-service.nix) · [Monitoring test](nix/checks/monitoring.nix)

![Project team chart with portraits and roles for the eight contributors listed below](docs/media/team.jpg)

| Contributor | Project role | Selected work |
| --- | --- | --- |
| Xiaofan Bu | Frontend Lead | [Scaffolded the login and signup components](https://github.com/DevEnjoysMath/multi-region-cloud-system/commit/5d0f0f8). |
| Ayush | Backend Lead | [Implemented JWT-based signup and login](https://github.com/DevEnjoysMath/multi-region-cloud-system/commit/ce09ec6). |
| Luke Bailey | DevOps Lead | [Packaged Schemathesis for API testing](https://github.com/DevEnjoysMath/multi-region-cloud-system/commit/b485b15). |
| Daniel Schwer | Frontend Engineer | [Added photos to the restaurant browser](https://github.com/DevEnjoysMath/multi-region-cloud-system/commit/77361f3). |
| Noah Scolard | Frontend Engineer | [Connected the frontend routes and added page transitions](https://github.com/DevEnjoysMath/multi-region-cloud-system/commit/fe2c574). |
| Erin Ryan | Frontend Engineer | [Built the menu, cart, and checkout UI](https://github.com/DevEnjoysMath/multi-region-cloud-system/commit/a01f4d9). |
| Dev Joshi | Cloud & DevOps Engineer | [Added distributed PostgreSQL and documented the architecture](https://github.com/DevEnjoysMath/multi-region-cloud-system/commit/21f94ea). |
| Darragh | Backend Engineer | [Implemented the restaurant and order APIs with JPA and integration tests](https://github.com/DevEnjoysMath/multi-region-cloud-system/commit/cab0410). |

## Run locally

Install [Nix](https://github.com/DeterminateSystems/nix-installer) with flakes enabled. On Windows, use [NixOS-WSL](https://github.com/nix-community/NixOS-WSL). On Coder, run `./scripts/setup-coder.sh` from the checkout first.

```bash
git clone https://github.com/DevEnjoysMath/multi-region-cloud-system.git
cd multi-region-cloud-system
nix develop
nix run .#compose
```

Process Compose starts the Bun frontend, Spring Boot backend, and PostgreSQL database. Open the URL printed by the frontend process and visit `/dashboard` to follow the recorded walkthrough.

| Command | Purpose |
| --- | --- |
| `nix fmt` | Apply the repository formatters before pushing. |
| `nix flake check -L` | Build the frontend and backend, run tests and VM checks, and check formatting. |
| `nix run .#docs.serve` | Serve the project documentation locally, including generated JavaDoc, TypeDoc, and OpenAPI reference material. |

When dependencies change, regenerate the relevant Nix lock data with `bun2nix -o bun.nix` in `frontend/` or `gradle2nix` in `backend/`. [Browse the project documentation in this repository](docs/src/SUMMARY.md)
