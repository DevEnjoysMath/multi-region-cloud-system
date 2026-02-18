# Integration test for Citus distributed PostgreSQL
# Tests that Citus extension loads and basic functionality works
{ self, inputs, ... }:
{
  perSystem =
    { pkgs, ... }:
    {
      checks.citusCluster = pkgs.testers.runNixOSTest {
        name = "citus-cluster";

        nodes = {
          postgres =
            { ... }:
            {
              imports = [
                self.nixosModules.postgres
                inputs.ragenix.nixosModules.default
              ];

              services.postgres-distributed = {
                enable = true;
                isCoordinator = true;
              };
            };
        };

        testScript = ''
          # Wait for PostgreSQL to start
          postgres.wait_for_unit("postgresql.service")
          postgres.wait_for_open_port(5432)

          # Verify Citus extension can be created
          postgres.succeed(
              "sudo -u postgres psql -c \"CREATE EXTENSION IF NOT EXISTS citus;\""
          )

          # Verify Citus is loaded
          result = postgres.succeed(
              "sudo -u postgres psql -t -c \"SELECT extname FROM pg_extension WHERE extname = 'citus';\""
          )
          assert "citus" in result, f"Citus extension not found: {result}"

          # Verify Citus version
          postgres.succeed(
              "sudo -u postgres psql -c \"SELECT citus_version();\""
          )

          # Test basic table creation (non-distributed for single node)
          postgres.succeed(
              "sudo -u postgres psql -c \"CREATE TABLE test_table (id serial PRIMARY KEY, data text);\""
          )
          postgres.succeed(
              "sudo -u postgres psql -c \"INSERT INTO test_table (data) VALUES ('test1'), ('test2');\""
          )
          result = postgres.succeed(
              "sudo -u postgres psql -t -c \"SELECT count(*) FROM test_table;\""
          )
          assert "2" in result, f"Expected 2 rows, got: {result}"
        '';
      };
    };
}
