import { Table } from "@mantine/core";
import "./styles/maxCropProduction.css";
import { useEffect, useState } from "react";
import config from "../config/config";

interface CropData {
  Year: string;
  "Crop Production (UOM:t(Tonnes))": number | string;
}

interface Element {
  year: number;
  maxCrop: number;
  minCrop: number;
}

function MaxCropProduction() {
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
    const yearToCropsMap: { [year: number]: number[] } = {};

    dataSet.forEach((crop) => {
      const year = parseInt(crop.Year.split(",")[1].trim(), 10);
      const production = crop["Crop Production (UOM:t(Tonnes))"]
        ? parseFloat(crop["Crop Production (UOM:t(Tonnes))"] as string)
        : 0;
      if (!yearToCropsMap[year]) {
        yearToCropsMap[year] = [];
      }
      yearToCropsMap[year].push(production);
    });

    const elements: Element[] = Object.entries(yearToCropsMap).map(
      ([year, productions]) => {
        const maxCrop = Math.max(...productions);
        const minCrop = Math.min(...productions);

        return {
          year: parseInt(year, 10),
          maxCrop: maxCrop,
          minCrop: minCrop,
        };
      }
    );

    return elements;
  };

  const rows = data.map((element) => (
    <Table.Tr key={element.year}>
      <Table.Td>{element.year}</Table.Td>
      <Table.Td>{element.maxCrop}</Table.Td>
      <Table.Td>{element.minCrop}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table className="table-container">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Year</Table.Th>
          <Table.Th>
            Crop with Maximum
            <br />
            Production in that Year
          </Table.Th>
          <Table.Th>
            Crop with Minimum
            <br />
            Production in that Year
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}

export default MaxCropProduction;
