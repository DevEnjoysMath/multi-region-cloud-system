{ inputs, lib, ... }:
{
  imports = [
    inputs.process-compose-flake.flakeModule
  ];

  perSystem =
    { pkgs, ... }:
    {
      process-compose.compose = {
        imports = [
          inputs.services-flake.processComposeModules.default
        ];

        cli.preHook = ''
          FLAKE_ROOT="$(git rev-parse --show-toplevel)"
          export FLAKE_ROOT

          export FRONTEND_PATH="$FLAKE_ROOT/frontend/dist"
        '';

        settings.processes = {
          backend.command = ''
            cd "$FLAKE_ROOT/backend" &&
            ${lib.getExe pkgs.gradle} bootRun --scan
          '';
          frontend.command = ''
            cd "$FLAKE_ROOT/frontend" &&
            ${lib.getExe pkgs.bun} install &&
            ${lib.getExe pkgs.bun} run dev
          '';
        };

        services.postgres."postgres" = {
          enable = true;
          initialScript.before = ''
            CREATE USER postgres SUPERUSER PASSWORD 'postgres';
            CREATE DATABASE sweng;
          '';
        };
      };
    };
}
