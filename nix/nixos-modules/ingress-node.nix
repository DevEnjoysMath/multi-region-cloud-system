# Ingress node - runs nginx as reverse proxy for the backend fleet
{ ... }:
{
  flake.nixosModules.ingressNode =
    { ... }:
    {
      services.toast-ingress = {
        enable = true;
        backends = [
          "backend-a.toast.internal:8080"
          "backend-b.toast.internal:8080"
        ];
      };
    };
}
