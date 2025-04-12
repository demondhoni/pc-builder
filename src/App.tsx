import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface ComponentOption {
  id: string;
  name: string;
  compatibility: Record<string, string | number | boolean>;
}

const COMPONENT_TYPES = [
  "cpu",
  "motherboard",
  "gpu",
  "ram",
  "storage",
  "psu",
  "case",
  "cooler",
];

const App: React.FC = () => {
  const [components, setComponents] = useState<
    Record<string, ComponentOption[]>
  >({});
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [compatibilityErrors, setCompatibilityErrors] = useState<string[]>([]);

  useEffect(() => {
    COMPONENT_TYPES.forEach(async (type) => {
      const res = await axios.get(`http://localhost:3001/${type}`);
      setComponents((prev) => ({ ...prev, [type]: res.data }));
    });
  }, []);

  const handleSelect = (type: string, id: string) => {
    setSelected((prev) => ({ ...prev, [type]: id }));
  };

  const checkCompatibility = async () => {
    const res = await axios.post("http://localhost:3001/compatibility-check", selected);

    setCompatibilityErrors(res.data.errors);
  };

  return (
    <div className="grid gap-6 p-6">
      <h1 className="text-3xl font-bold">PC Builder</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COMPONENT_TYPES.map((type) => (
          <Card key={type}>
            <CardContent className="p-4">
              <h2 className="font-semibold capitalize mb-2">{type}</h2>
              <Select onValueChange={(value) => handleSelect(type, value)}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select a ${type}`} />
                </SelectTrigger>
                <SelectContent>
                  {components[type]?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button className="w-full md:w-1/3" onClick={checkCompatibility}>
        Check Compatibility
      </Button>
      {compatibilityErrors.length > 0 && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold">Compatibility Issues:</h3>
          <ul className="list-disc ml-5">
            {compatibilityErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
