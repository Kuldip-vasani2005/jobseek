import React from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

// Salary ranges in LPA
const filterData = [
  {
    filterType: "Location",
    array: ["Surat", "Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "Full Stack Developer"],
  },
  {
    filterType: "Salary",
    array: [
      { min: 0, max: 3 },   // 0–3 LPA
      { min: 3, max: 6 },   // 3–6 LPA
      { min: 6, max: 10 },  // 6–10 LPA
      { min: 10, max: 15 }, // 10–15 LPA
      { min: 15, max: 20 }, // 15–20 LPA
      { min: 20, max: Infinity }, // 20+ LPA
    ],
  },
];

const FilterCard = ({ selectedFilters, onFilterChange, onClearFilters }) => {
  const formatSalaryRange = (range) => {
    if (range.max === Infinity) {
      return `₹${range.min} LPA+`;
    }
    return `₹${range.min} – ₹${range.max} LPA`;
  };

  return (
    <div className="w-full bg-white p-5 rounded-xl shadow-md flex flex-col justify-between">
      <div>
        <h1 className="font-bold text-xl text-gray-800">Filter Jobs</h1>
        <hr className="my-3 border-gray-300" />

        {filterData.map((data, index) => (
          <div key={index} className="my-4">
            <h2 className="font-semibold text-lg text-gray-700">{data.filterType}</h2>

            <RadioGroup
              value={selectedFilters[data.filterType] || ""}
              onValueChange={(val) => onFilterChange(data.filterType, val)}
            >
              {data.array.map((item, idx) => {
                const itemId = `${data.filterType}-${idx}`;
                const value =
                  data.filterType === "Salary"
                    ? `${item.min}-${item.max}`
                    : item;
                const isSelected = selectedFilters[data.filterType] === value;

                return (
                  <div
                    key={idx}
                    className={`flex items-center space-x-2 my-2 cursor-pointer px-2 py-1 rounded-md ${
                      isSelected ? "bg-orange-100" : "hover:bg-gray-100"
                    }`}
                  >
                    <RadioGroupItem
                      value={value}
                      id={itemId}
                      className={`${
                        isSelected ? "text-orange-600 border-orange-500" : ""
                      }`}
                    />
                    <Label
                      htmlFor={itemId}
                      className={`${
                        isSelected ? "text-orange-700 font-semibold" : ""
                      }`}
                    >
                      {data.filterType === "Salary"
                        ? formatSalaryRange(item)
                        : item}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        ))}
      </div>

      {/* ✅ Clear Filters Button */}
      <Button
        onClick={onClearFilters}
        variant="outline"
        className="mt-4 text-red-600 border-red-300 hover:bg-red-50"
      >
        Clear All Filters
      </Button>
    </div>
  );
};

export default FilterCard;
