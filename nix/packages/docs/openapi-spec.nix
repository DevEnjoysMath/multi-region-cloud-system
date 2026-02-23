{
  perSystem =
    { pkgs, ... }:
    let
      openapiSpec = ../../../specs/openapi.yaml;
    in
    rec {
      packages.openapi-docs =
        pkgs.runCommandLocal "openapi-docs"
          {
            nativeBuildInputs = [
              pkgs.redocly
              pkgs.openapi-generator-cli
            ];
          }
          ''
            redocly lint "${openapiSpec}" --lint-config error
            openapi-generator-cli validate -i "${openapiSpec}"

            mkdir -p "$out/share/docs/openapi"

            openapi-generator-cli generate -i "${openapiSpec}" -g html2 -o "$out/share/docs/openapi/index.html"
          '';
      checks.openapi-docs = packages.openapi-docs;
    };
}
