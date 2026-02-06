# Integration test for Citus distributed PostgreSQL
{ self, ... }:
{
  perSystem =
    { pkgs, ... }:
    {
      checks.citusCluster = pkgs.testers.runNixOSTest {
        name = "citus-cluster";

        nodes = {
          coordinator =
            { ... }:
            {
              imports = [ self.nixosModules.postgres ];

              services.postgres-distributed = {
                enable = true;
                isCoordinator = true;
                coordinatorAddress = "coordinator";
                workerNodes = [ "worker" ];
              };

              networking.firewall.allowedTCPPorts = [ 5432 ];
            };

          worker =
            { ... }:
            {
              imports = [ self.nixosModules.postgres ];

              services.postgres-distributed = {
                enable = true;
                isCoordinator = false;
                coordinatorAddress = "coordinator";
              };

              networking.firewall.allowedTCPPorts = [ 5432 ];
            };
        };

        testScript = ''
          # Wait for PostgreSQL to start on both nodes
          coordinator.wait_for_unit("postgresql.service")
          worker.wait_for_unit("postgresql.service")

          # Wait for ports to be open
          coordinator.wait_for_open_port(5432)
          worker.wait_for_open_port(5432)

          # Verify Citus extension is available on coordinator
          coordinator.succeed(
              "sudo -u postgres psql -c \"CREATE EXTENSION IF NOT EXISTS citus;\""
          )

          # Verify Citus extension is available on worker
          worker.succeed(
              "sudo -u postgres psql -c \"CREATE EXTENSION IF NOT EXISTS citus;\""
          )

          # Add worker to the coordinator cluster
          coordinator.succeed(
              "sudo -u postgres psql -c \"SELECT citus_set_coordinator_host('coordinator', 5432);\""
          )
          coordinator.succeed(
              "sudo -u postgres psql -c \"SELECT * from citus_add_node('worker', 5432);\""
          )

          # Verify worker is registered
          result = coordinator.succeed(
              "sudo -u postgres psql -t -c \"SELECT count(*) FROM citus_get_active_worker_nodes();\""
          )
          assert "1" in result, f"Expected 1 worker node, got: {result}"

          # Create a distributed table and verify it works
          coordinator.succeed(
              "sudo -u postgres psql -c \"CREATE TABLE test_distributed (id serial, data text);\""
          )
          coordinator.succeed(
              "sudo -u postgres psql -c \"SELECT create_distributed_table('test_distributed', 'id');\""
          )

          # Insert some data
          coordinator.succeed(
              "sudo -u postgres psql -c \"INSERT INTO test_distributed (data) VALUES ('test1'), ('test2'), ('test3');\""
          )

          # Verify data can be queried
          result = coordinator.succeed(
              "sudo -u postgres psql -t -c \"SELECT count(*) FROM test_distributed;\""
          )
          assert "3" in result, f"Expected 3 rows, got: {result}"
        '';
      };
    };
}
