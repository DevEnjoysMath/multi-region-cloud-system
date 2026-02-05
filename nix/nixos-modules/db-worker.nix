# Citus worker node configuration
_: {
  flake.nixosModules.dbWorker = _: {
    services.postgres-distributed = {
      enable = true;
      isCoordinator = false;
      coordinatorAddress = "db-coordinator.toast.internal";
    };
  };
}
