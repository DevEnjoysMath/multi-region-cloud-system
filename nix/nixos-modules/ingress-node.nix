# Ingress node - runs nginx as reverse proxy for the backend fleet
_: {
  flake.nixosModules.ingressNode = _: {
    services.toast-ingress = {
      enable = true;
      backends = [
        "backend-a.toast.internal:8080"
        "backend-b.toast.internal:8080"
      ];
    };
  };
}
