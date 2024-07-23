import { Table } from "@mantine/core";
import "./styles/avgCropProduction.css";
import { useEffect, useState } from "react";
import config from "../config/config";

interface CropData {
  "Crop Name": string;
  "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": number | string;
  "Area Under Cultivation (UOM:Ha(Hectares))": number | string;
}

interface Element {
  crop: string;
  avgYieldCrop: number;
  avgCultivationCrop: number;
}

function AvgCropProduction() {
  const [data, setData] = useState<Element[]>([]);

  useEffect(() => {
    fetchDataSet();
  }, []);

  const fetchDataSet = async () => {
    try {
      const response = await fetch(config.serverUrl);
      if (response.status === 200) {
        const dataSet: CropData[] = await response.json();
        const processedData = processCropData(dataSet);
        setData(processedData);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const processCropData = (dataSet: CropData[]): Element[] => {
    const cropToDataMap: {
      [crop: string]: { yield: number[]; area: number[] };
    } = {};

    dataSet.forEach((crop) => {
      const cropName = crop["Crop Name"];
      const yieldValue = crop["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"]
        ? parseFloat(
            crop["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"] as string
          )
        : 0;
      const areaValue = crop["Area Under Cultivation (UOM:Ha(Hectares))"]
        ? parseFloat(
            crop["Area Under Cultivation (UOM:Ha(Hectares))"] as string
          )
        : 0;

      if (!cropToDataMap[cropName]) {
        cropToDataMap[cropName] = { yield: [], area: [] };
      }
      cropToDataMap[cropName].yield.push(yieldValue);
      cropToDataMap[cropName].area.push(areaValue);
    });

    const elements: Element[] = Object.entries(cropToDataMap).map(
      ([crop, data]) => {
        const avgYield =
          data.yield.reduce((sum, value) => sum + value, 0) / data.yield.length;
        const avgArea =
          data.area.reduce((sum, value) => sum + value, 0) / data.area.length;

        return {
          crop: crop,
          avgYieldCrop: avgYield,
          avgCultivationCrop: avgArea,
        };
      }
    );

    return elements;
  };

  const rows = data.map((element) => (
    <Table.Tr key={element.crop}>
      <Table.Td>{element.crop}</Table.Td>
      <Table.Td>{element.avgYieldCrop.toFixed(3)}</Table.Td>
      <Table.Td>{element.avgCultivationCrop.toFixed(3)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table className="table-container">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Crop</Table.Th>
          <Table.Th>
            Average Yield of the
            <br />
            Crop between
            <br />
            1950-2020
          </Table.Th>
          <Table.Th>
            Average Cultivation Area
            <br />
            of the Crop between
            <br />
            1950-2020
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

export default AvgCropProduction;
