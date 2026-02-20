{
  perSystem =
    { pkgs, inputs', ... }:
    {
      devShells.default = pkgs.mkShell {
        packages = with pkgs; [
          git

          gradle_9
          spring-boot-cli
          openjdk25
          inputs'.gradle2nix.packages.gradle2nix

          bun
          inputs'.bun2nix.packages.bun2nix

          mdbook
          openapi-tui

          rage
          inputs'.ragenix.packages.ragenix
        ];

        shellHook = ''
          export FLAKE_ROOT="$(git rev-parse --show-toplevel)"
          export FRONTEND_PATH="$FLAKE_ROOT/frontend/dist"
        '';
      };
    };
}
