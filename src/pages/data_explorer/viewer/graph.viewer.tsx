import { ResponsiveLine } from "@nivo/line";
import { ChartData } from "..";

interface GraphDataViewerProps {
  data: ChartData;
}

export function GraphDataViewer({ data }: GraphDataViewerProps) {
  return (
    <div style={{ height: "80vh" }}>
      <ResponsiveLine
        data={data}
        useMesh
        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
        xScale={{
          type: "time", // Use 'point' for categorical data, 'time' for date data
          format: "%Y-%m-%dT%H:%M:%S.%LZ", // ISO 8601 date format for parsing time
          precision: "minute", // Adjust to 'hour' or 'day' depending on granularity
        }}
        xFormat="time:%Y-%m-%d %H:%M" // Display format for x-axis ticks
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false, // Set to true for stacking, if using multiple series
          reverse: false,
        }}
        curve="monotoneX" // Options: 'linear', 'monotoneX', 'step', etc.
        yFormat=" >-.2f" // Format numbers to 2 decimal places on y-axis
        // axisTop={null}
        // axisRight={null}
        axisBottom={{
          format: "%Y-%m-%d %H:%M", // Keep the x-axis format simple
          tickValues: "every 2 hours", // Optional: show a tick every 2 hours for readability
          tickPadding: 5,
          tickRotation: 0,
          legend: "Date and Time",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Sensor Value",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabel="yFormatted"
        pointLabelYOffset={-12}
        enableSlices="x" // Shows vertical lines on hover, good for time series
        enableArea={true} // Fill under the line
        enableCrosshair={true} // Display a crosshair for better tracking
        crosshairType="bottom" // Show crosshair on x-axis
        enableGridX={false} // Disable grid on x-axis for cleaner view
        enableGridY={true} // Enable grid on y-axis to improve readability
        colors={{ scheme: "set1" }} // Color scheme, e.g., 'nivo', 'set1', 'dark2'
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 0,
            translateY: -450,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 60,
            itemHeight: 20,
            itemOpacity: 1,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            itemBackground: "rgba(0, 0, 0, .5)",
            itemTextColor: "white",
            padding: 5,
          },
        ]}
        sliceTooltip={({ slice }) => {
          const points = slice.points.map((point) => (
            <div key={point.id} style={{ color: point.serieColor }}>
              {point.serieId}: {point.data.yFormatted} at (
              {point.data.xFormatted})
            </div>
          ));
          return (
            <div
              style={{
                background: "rgba(0,0,0,0.75)",
                color: "white",
                padding: "5px 10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              {points}
            </div>
          );
        }}
      />
    </div>
  );
}
