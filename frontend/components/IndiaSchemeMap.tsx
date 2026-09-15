import React, { useEffect, useRef, useState } from "react";

interface IndiaSchemeMapProps {
  onCheckEligibility?: () => void;
  showEligibilityButton?: boolean;
}

interface StateInfo {
  code: string;
  name: string;
  schemes: number;
}

const STATE_DATA: StateInfo[] = [
  { code: "JK", name: "Jammu & Kashmir", schemes: 8 },
  { code: "LA", name: "Ladakh", schemes: 5 },
  { code: "HP", name: "Himachal Pradesh", schemes: 7 },
  { code: "PB", name: "Punjab", schemes: 9 },
  { code: "HR", name: "Haryana", schemes: 10 },
  { code: "UK", name: "Uttarakhand", schemes: 8 },
  { code: "RJ", name: "Rajasthan", schemes: 12 },
  { code: "UP", name: "Uttar Pradesh", schemes: 14 },
  { code: "BR", name: "Bihar", schemes: 11 },
  { code: "JH", name: "Jharkhand", schemes: 8 },
  { code: "WB", name: "West Bengal", schemes: 10 },
  { code: "SK", name: "Sikkim", schemes: 5 },
  { code: "AR", name: "Arunachal Pradesh", schemes: 6 },
  { code: "AS", name: "Assam", schemes: 9 },
  { code: "MN", name: "Manipur", schemes: 6 },
  { code: "ML", name: "Meghalaya", schemes: 6 },
  { code: "MZ", name: "Mizoram", schemes: 5 },
  { code: "NL", name: "Nagaland", schemes: 6 },
  { code: "TR", name: "Tripura", schemes: 6 },
  { code: "DL", name: "Delhi", schemes: 10 },
  { code: "MP", name: "Madhya Pradesh", schemes: 12 },
  { code: "CG", name: "Chhattisgarh", schemes: 9 },
  { code: "GJ", name: "Gujarat", schemes: 11 },
  { code: "MH", name: "Maharashtra", schemes: 15 },
  { code: "GA", name: "Goa", schemes: 6 },
  { code: "KA", name: "Karnataka", schemes: 13 },
  { code: "TS", name: "Telangana", schemes: 10 },
  { code: "AP", name: "Andhra Pradesh", schemes: 10 },
  { code: "OD", name: "Odisha", schemes: 11 },
  { code: "TN", name: "Tamil Nadu", schemes: 13 },
  { code: "KL", name: "Kerala", schemes: 12 },
  { code: "AN", name: "Andaman & Nicobar Islands", schemes: 5 },
  { code: "LD", name: "Lakshadweep", schemes: 4 },
  { code: "PY", name: "Puducherry", schemes: 5 },
  { code: "CH", name: "Chandigarh", schemes: 5 },
  {
    code: "DD",
    name: "Dadra & Nagar Haveli and Daman & Diu",
    schemes: 5,
  },
];

const NAME_TO_CODE: Record<string, string> = {
  "jammu and kashmir": "JK",
  "jammu & kashmir": "JK",
  ladakh: "LA",
  "himachal pradesh": "HP",
  punjab: "PB",
  haryana: "HR",
  uttarakhand: "UK",
  rajasthan: "RJ",
  "uttar pradesh": "UP",
  bihar: "BR",
  jharkhand: "JH",
  "west bengal": "WB",
  sikkim: "SK",
  "arunachal pradesh": "AR",
  assam: "AS",
  manipur: "MN",
  meghalaya: "ML",
  mizoram: "MZ",
  nagaland: "NL",
  tripura: "TR",
  delhi: "DL",
  "madhya pradesh": "MP",
  chhattisgarh: "CG",
  gujarat: "GJ",
  maharashtra: "MH",
  goa: "GA",
  karnataka: "KA",
  telangana: "TS",
  "andhra pradesh": "AP",
  odisha: "OD",
  orissa: "OD",
  "tamil nadu": "TN",
  kerala: "KL",
  "andaman and nicobar islands": "AN",
  "andaman & nicobar islands": "AN",
  lakshadweep: "LD",
  puducherry: "PY",
  pondicherry: "PY",
  chandigarh: "CH",
  "dadra and nagar haveli and daman and diu": "DD",
  "dadra & nagar haveli and daman & diu": "DD",
  "dadra and nagar haveli": "DD",
  "daman and diu": "DD",
};

const SHORT_LABELS: Record<string, string> = {
  JK: "J&K",
  LA: "Ladakh",
  HP: "HP",
  PB: "Punjab",
  HR: "Haryana",
  UK: "Uttarakhand",
  RJ: "Rajasthan",
  UP: "U.P.",
  BR: "Bihar",
  JH: "Jharkhand",
  WB: "W.B.",
  SK: "Sikkim",
  AR: "Arunachal",
  AS: "Assam",
  MN: "Manipur",
  ML: "Meghalaya",
  MZ: "Mizoram",
  NL: "Nagaland",
  TR: "Tripura",
  DL: "Delhi",
  MP: "M.P.",
  CG: "C.G.",
  GJ: "Gujarat",
  MH: "Maharashtra",
  GA: "Goa",
  KA: "Karnataka",
  TS: "Telangana",
  AP: "A.P.",
  OD: "Odisha",
  TN: "Tamil Nadu",
  KL: "Kerala",
  AN: "A&N",
  LD: "Lakshadweep",
  PY: "Puducherry",
  CH: "Chandigarh",
  DD: "D&NH + D&D",
};

const GEOJSON_URL =
  "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/india.geojson";

export  function IndiaSchemeMap({
  onCheckEligibility,
  showEligibilityButton = true,
}: IndiaSchemeMapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const d3Ref = useRef<any>(null);
  const zoomRef = useRef<any>(null);
  const selectedCodeRef = useRef<string | null>(null);

  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    selectedCodeRef.current = selectedCode;
  }, [selectedCode]);

  const getFeatureName = (feature: any): string => {
    const properties = feature?.properties || {};

    return (
      properties.NAME_1 ||
      properties.name ||
      properties.NAME ||
      properties.ST_NM ||
      properties.st_nm ||
      properties.ST_NAME ||
      properties.state ||
      properties.State ||
      ""
    );
  };

  const normalizeName = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, " ").trim();
  };

  const getStateCode = (feature: any): string | null => {
    const name = getFeatureName(feature);

    if (!name) {
      return null;
    }

    return NAME_TO_CODE[normalizeName(name)] || null;
  };

  const getStateInfo = (code: string | null): StateInfo | null => {
    if (!code) {
      return null;
    }

    return STATE_DATA.find((state) => state.code === code) || null;
  };

  const drawMap = (d3: any, geojson: any) => {
    const svgElement = svgRef.current;
    const container = containerRef.current;

    if (!svgElement || !container) {
      return;
    }

    const width = Math.max(container.clientWidth, 600);
    const height = 620;

    const svg = d3.select(svgElement);

    svg.selectAll("*").remove();

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", height);

    const mapGroup = svg
      .append("g")
      .attr("class", "india-map-group");

    const projection = d3
      .geoMercator()
      .fitExtent(
        [
          [25, 20],
          [width - 25, height - 25],
        ],
        geojson
      );

    const path = d3.geoPath().projection(projection);

    const features = geojson.features || [];

    /*
      Kuch states/UTs multiple polygons mein hote hain.
      Isliye label ke liye har state ka sirf largest polygon use hoga.
    */
    const mainFeatureByCode = new Map<string, any>();

    features.forEach((feature: any) => {
      const code = getStateCode(feature);

      if (!code) {
        return;
      }

      const existing = mainFeatureByCode.get(code);

      if (!existing) {
        mainFeatureByCode.set(code, feature);
        return;
      }

      try {
        const oldArea = d3.geoArea(existing);
        const newArea = d3.geoArea(feature);

        if (newArea > oldArea) {
          mainFeatureByCode.set(code, feature);
        }
      } catch {
        // Existing feature ko use karenge.
      }
    });

    const getFill = (code: string | null): string => {
      if (code === selectedCodeRef.current) {
        return "#C0392B";
      }

      const state = getStateInfo(code);

      if (!state) {
        return "#E8E4DA";
      }

      const intensity = Math.min(state.schemes / 15, 1);

      if (intensity > 0.75) {
        return "#D96B5F";
      }

      if (intensity > 0.5) {
        return "#E28B80";
      }

      if (intensity > 0.3) {
        return "#EBA9A0";
      }

      return "#F0C3BD";
    };

    const tooltip = d3
      .select(container)
      .selectAll(".india-map-tooltip")
      .data([null])
      .join("div")
      .attr("class", "india-map-tooltip")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("display", "none")
      .style("background", "#16324F")
      .style("color", "#FFFFFF")
      .style("padding", "10px 12px")
      .style("border-radius", "8px")
      .style("font-size", "12px")
      .style("line-height", "1.4")
      .style("box-shadow", "0 5px 20px rgba(0,0,0,0.15)")
      .style("z-index", "20");

    const statePaths = mapGroup
  .selectAll(".india-state")
      .data(features)
      .join("path")
      .attr("class", "india-state")
      .attr("d", path)
      .attr("fill", (feature: any) =>
        getFill(getStateCode(feature))
      )
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 1)
      .attr("vector-effect", "non-scaling-stroke")
      .style("cursor", (feature: any) =>
        getStateInfo(getStateCode(feature))
          ? "pointer"
          : "default"
      );

    statePaths
      .on(
        "mouseenter",
        function (
          this: SVGPathElement,
          event: MouseEvent,
          feature: any
        ) {
          const code = getStateCode(feature);
          const state = getStateInfo(code);

          if (!state) {
            return;
          }

          d3.select(this)
            .raise()
            .attr("stroke", "#16324F")
            .attr("stroke-width", 2);

          const rect = container.getBoundingClientRect();

          tooltip
            .style("display", "block")
            .html(
              `<strong>${state.name}</strong><br/>${state.schemes} schemes`
            )
            .style(
              "left",
              `${event.clientX - rect.left + 12}px`
            )
            .style(
              "top",
              `${event.clientY - rect.top + 12}px`
            );
        }
      )
      .on(
        "mousemove",
        function (event: MouseEvent) {
          const rect = container.getBoundingClientRect();

          tooltip
            .style(
              "left",
              `${event.clientX - rect.left + 12}px`
            )
            .style(
              "top",
              `${event.clientY - rect.top + 12}px`
            );
        }
      )
      .on(
        "mouseleave",
        function (this: SVGPathElement) {
          d3.select(this)
            .attr("stroke", "#FFFFFF")
            .attr("stroke-width", 1);

          tooltip.style("display", "none");
        }
      )
      .on(
        "click",
        function (_event: MouseEvent, feature: any) {
          const code = getStateCode(feature);

          if (!code || !getStateInfo(code)) {
            return;
          }

          selectedCodeRef.current = code;
          setSelectedCode(code);

          statePaths.attr("fill", (item: any) =>
            getFill(getStateCode(item))
          );
        }
      );

    /*
      Har state ka sirf ONE label.
    */
    mainFeatureByCode.forEach((feature, code) => {
      const state = getStateInfo(code);

      if (!state) {
        return;
      }

      const centroid = path.centroid(feature);

      if (
        !Number.isFinite(centroid[0]) ||
        !Number.isFinite(centroid[1])
      ) {
        return;
      }

      const label = SHORT_LABELS[code] || state.name;

      mapGroup
        .append("text")
        .attr("x", centroid[0])
        .attr("y", centroid[1])
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr(
          "font-size",
          code === "MH" || code === "RJ" ? 11 : 9
        )
        .attr("font-weight", "700")
        .attr("fill", "#16324F")
        .attr("pointer-events", "none")
        .text(label);
    });

    const zoom = d3
      .zoom()
      .scaleExtent([1, 6])
      .on("zoom", (event: any) => {
        mapGroup.attr("transform", event.transform);
      });

    zoomRef.current = zoom;

    svg.call(zoom);

    svg.call(
      zoom.transform,
      d3.zoomIdentity
    );

    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;

    const loadMap = async () => {
      try {
        setLoading(true);
        setError(null);

        const d3 = await new Function(
          "url",
          "return import(url)"
        )("https://cdn.jsdelivr.net/npm/d3@7/+esm");

        if (cancelled) {
          return;
        }

        d3Ref.current = d3;

        const response = await fetch(GEOJSON_URL);

        if (!response.ok) {
          throw new Error("India map data load nahi hua.");
        }

        const geojson = await response.json();

        if (cancelled) {
          return;
        }

        drawMap(d3, geojson);
      } catch (err) {
        console.error("India map error:", err);

        if (!cancelled) {
          setError(
            "Map load nahi ho pa raha. Please refresh karke try karo."
          );
          setLoading(false);
        }
      }
    };

    loadMap();

    return () => {
      cancelled = true;
    };
  }, []);

  const zoomIn = () => {
    const svgElement = svgRef.current;
    const d3 = d3Ref.current;

    if (!svgElement || !d3 || !zoomRef.current) {
      return;
    }

    d3.select(svgElement)
      .transition()
      .duration(250)
      .call((selection: any) => {
        zoomRef.current.scaleBy(selection, 1.4);
      });
  };

  const zoomOut = () => {
    const svgElement = svgRef.current;
    const d3 = d3Ref.current;

    if (!svgElement || !d3 || !zoomRef.current) {
      return;
    }

    d3.select(svgElement)
      .transition()
      .duration(250)
      .call((selection: any) => {
        zoomRef.current.scaleBy(selection, 0.7);
      });
  };

  const resetZoom = () => {
    const svgElement = svgRef.current;
    const d3 = d3Ref.current;

    if (!svgElement || !d3 || !zoomRef.current) {
      return;
    }

    d3.select(svgElement)
      .transition()
      .duration(300)
      .call(
        (selection: any) => {
          zoomRef.current.transform(
            selection,
            d3.zoomIdentity
          );
        }
      );
  };

  const refreshMap = () => {
    window.location.reload();
  };

  const selectedState = getStateInfo(selectedCode);

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#16324F]">
              Scheme Map
            </h2>

            <p className="mt-1 text-sm text-[#3E5A76]">
              State-wise government scheme coverage
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={zoomOut}
              className="h-9 w-9 rounded-lg border border-[#D8D2C4] bg-white font-bold text-[#16324F] hover:bg-[#F7F5EF]"
            >
              −
            </button>

            <button
              type="button"
              onClick={resetZoom}
              className="h-9 rounded-lg border border-[#D8D2C4] bg-white px-3 text-sm font-medium text-[#16324F] hover:bg-[#F7F5EF]"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={zoomIn}
              className="h-9 w-9 rounded-lg border border-[#D8D2C4] bg-white font-bold text-[#16324F] hover:bg-[#F7F5EF]"
            >
              +
            </button>

            <button
              type="button"
              onClick={refreshMap}
              title="Refresh map"
              className="h-9 w-9 rounded-lg border border-[#D8D2C4] bg-white text-[#16324F] hover:bg-[#F7F5EF]"
            >
              ↻
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative w-full overflow-hidden rounded-2xl border border-[#D8D2C4] bg-[#F7F5EF]"
        >
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#F7F5EF]/90">
              <div className="text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#D8D2C4] border-t-[#C0392B]" />

                <p className="text-sm font-medium text-[#16324F]">
                  India map loading...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#F7F5EF] px-6">
              <div className="text-center">
                <p className="text-sm font-medium text-[#C0392B]">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={refreshMap}
                  className="mt-3 rounded-lg bg-[#C0392B] px-4 py-2 text-sm font-semibold text-white"
                >
                  Refresh
                </button>
              </div>
            </div>
          )}

          <svg
            ref={svgRef}
            className="block w-full"
            role="img"
            aria-label="Interactive map of India showing government scheme coverage"
          />
        </div>

        {selectedState && (
          <div className="rounded-xl border border-[#D8D2C4] bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#3E5A76]">
                  Selected State / UT
                </p>

                <h3 className="mt-1 text-lg font-bold text-[#16324F]">
                  {selectedState.name}
                </h3>

                <p className="mt-1 text-sm text-[#3E5A76]">
                  {selectedState.schemes} schemes available
                </p>
              </div>

              {showEligibilityButton &&
                onCheckEligibility && (
                  <button
                    type="button"
                    onClick={onCheckEligibility}
                    className="rounded-lg bg-[#C0392B] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Check Eligibility
                  </button>
                )}
            </div>
          </div>
        )}

        {!selectedState && (
          <div className="text-center">
            <p className="text-sm text-[#3E5A76]">
              Click on a state or UT to view scheme coverage.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}