{
  perSystem =
    { inputs', pkgs, ... }:
    let
      inherit (inputs'.bun2nix.packages) bun2nix;
      src = ../../../frontend;
      pkgJson = builtins.fromJSON (builtins.readFile "${src}/package.json");
    in
    rec {
      packages.frontend-docs = pkgs.stdenv.mkDerivation {
        pname = pkgJson.name;

        inherit src;
        inherit (pkgJson) version;

        nativeBuildInputs = [
          bun2nix.hook
        ];

        bunDeps = bun2nix.fetchBunDeps {
          bunNix = "${src}/bun.nix";
        };

        buildPhase = ''
          bun run docs
        '';

        installPhase = ''
          mkdir -p "$out/share/docs/frontend"

          cp -R ./docs/. "$out/share/docs/frontend"
        '';
      };
      checks.frontend-docs = packages.frontend-docs;
    };
}
