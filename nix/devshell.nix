{
  perSystem =
    { pkgs, inputs', ... }:
    {
      devShells.default = pkgs.mkShell {
        packages = with pkgs; [
          gradle_9
          spring-boot-cli
          openjdk25
          inputs'.gradle2nix.packages.gradle2nix

          bun
          inputs'.bun2nix.packages.bun2nix

          cachix
          omnix

          mdbook
        ];

        shellHook = ''
          export FLAKE_ROOT="$(git rev-parse --show-toplevel)"
          export FRONTEND_PATH="$FLAKE_ROOT/frontend/dist"
        '';
      };
    };
}
