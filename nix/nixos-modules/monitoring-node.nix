# Monitoring node - runs Prometheus, Grafana, and Loki
{
  flake.nixosModules.monitoringNode = {
    # enable all monitoring services
    services.toast-prometheus = {
      enable = true;
      scrapeTargets = [
        "backend-a.toast.internal:8080"
        "backend-b.toast.internal:8080"
        "db-coordinator.toast.internal:9100"
        "db-worker-1.toast.internal:9100"
        "db-worker-2.toast.internal:9100"
      ];
    };

    services.toast-grafana = {
      enable = true;
      prometheusUrl = "http://localhost:9090";
      lokiUrl = "http://localhost:3100";
    };

    services.toast-loki.enable = true;
  };
}
