{ inputs, ... }:
let
  inherit (inputs) gradle2nix;
in
{
  perSystem =
    { system, pkgs, ... }:
    rec {
      packages.backend-docs = gradle2nix.builders.${system}.buildGradlePackage rec {
        pname = "backend-docs";
        version = "0.1.0";

        gradle = pkgs.gradle_9-unwrapped;

        nativeBuildInputs = [
          pkgs.openjdk25
        ];

        src = ../../../backend;
        lockFile = "${src}/gradle.lock";

        gradleBuildFlags = [
          "Javadoc"
        ];

        installPhase = ''
          mkdir -p "$out/share/docs/backend"

          cp -R build/docs/javadoc/. "$out/share/docs/backend"
        '';
      };
      checks.backend-docs = packages.backend-docs;
    };
}
