"use client";

import { createFileRoute } from "@tanstack/react-router";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
// import geonamesAllCitiesWithAPopulationTenThousandOrMore from "@/data/geonames-all-cities-with-a-population-1000@public.geo.json";
import geonamesAllCitiesWithAPopulationTenThousandOrMore from "@/data/geonames-all-cities-with-a-population-1000@public.geo.json";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  ChevronsUpDown,
  CloudUpload,
  Command,
  Paperclip,
} from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { RichTextEditor } from "@/components/rich-text-editor";
import type { Feature } from "geojson";
import type { Alumni } from "@/data/mockAlumni";
import { cn } from "@/lib/utils";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface GeoJSONFeature extends Feature {
  lng: number;
  lat: number;
  size: number;
}

const formSchema = z.object({
  first: z.string().min(1).min(3).max(255),
  last: z.string().min(1).min(3).max(255),
  major: z.string().min(1).min(5).max(255),
  degree: z.string().min(1).min(5).max(255),
  gradYear: z.string(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  title: z.string().min(1).min(3).max(255),
  imageUrl: z.string(),
  details: z.string().min(100).max(1000),
});

export const Route = createFileRoute("/form")({
  component: MyForm,
});

// Generate years from 1970 to current year for graduation year dropdown
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let year = currentYear; year >= 1960; year--) {
    years.push(year.toString());
  }
  return years;
};

export default function MyForm() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const graduationYears = useMemo(() => generateYears(), []);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
      state: "",
      city: "",
      gradYear: new Date().getFullYear().toString(),
      imageUrl: "",
      details: "",
    },
  });

  // Parse geoJSON data to extract countries, states, and cities
  const { countries, statesByCountry, citiesByState } = useMemo(() => {
    const features = (geonamesAllCitiesWithAPopulationTenThousandOrMore as any)
      .features as GeoJSONFeature[];

    // Extract unique countries
    const countriesMap = new Map<string, string>();
    const statesByCountryMap = new Map<string, Map<string, string>>();
    const citiesByStateMap = new Map<string, Feature[]>();

    features.forEach((feature) => {
      const countryCode = feature.properties?.country_code;
      const countryName = feature.properties?.cou_name_en || countryCode;
      const stateCode = feature.properties?.admin1_code;
      const stateName = stateCode || "";
      const countryStateKey = `${countryCode}-${stateCode}`;

      // Add country if not exists
      if (countryCode && !countriesMap.has(countryCode)) {
        countriesMap.set(countryCode, countryName);
      }

      // Add state if not exists
      if (countryCode && stateCode) {
        if (!statesByCountryMap.has(countryCode)) {
          statesByCountryMap.set(countryCode, new Map<string, string>());
        }

        const statesMap = statesByCountryMap.get(countryCode);
        if (statesMap && !statesMap.has(stateCode)) {
          statesMap.set(stateCode, stateName);
        }
      }

      // Add city by state
      if (countryStateKey) {
        if (!citiesByStateMap.has(countryStateKey)) {
          citiesByStateMap.set(countryStateKey, []);
        }

        const cities = citiesByStateMap.get(countryStateKey);
        if (cities) {
          cities.push(feature);
        }
      }
    });

    return {
      countries: Array.from(countriesMap.entries()).map(([code, name]) => ({
        code,
        name,
      })),
      statesByCountry: Object.fromEntries(
        Array.from(statesByCountryMap.entries()).map(
          ([countryCode, statesMap]) => [
            countryCode,
            Array.from(statesMap.entries()).map(([code, name]) => ({
              code,
              name,
            })),
          ],
        ),
      ),
      citiesByState: Object.fromEntries(
        Array.from(citiesByStateMap.entries()).map(
          ([countryStateKey, cities]) => [countryStateKey, cities],
        ),
      ),
    };
  }, []);

  // Reset state and city when country changes
  useEffect(() => {
    if (selectedCountry !== form.getValues("country")) {
      form.setValue("state", "");
      form.setValue("city", "");
      setSelectedState("");
    }
  }, [form.getValues("country")]);

  // Reset city when state changes
  useEffect(() => {
    if (selectedState !== form.getValues("state")) {
      form.setValue("city", "");
    }
  }, [form.getValues("state")]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Find the selected city coordinates
      const countryCode = selectedCountry;
      const stateCode = selectedState;
      const countryStateKey = `${countryCode}-${stateCode}`;

      const selectedCityFeatures = citiesByState[countryStateKey]?.filter(
        (city) => city.properties?.name === values.city,
      );

      const selectedCityFeature = selectedCityFeatures?.[0] as
        | GeoJSONFeature
        | undefined;

      // Format the address like in mockAlumni
      const address = [
        values.city,
        stateCode ? `${stateCode}` : undefined,
        countryCode,
      ]
        .filter(Boolean)
        .join(", ");

      // Create alumni object in the format of mockAlumni
      const alumniData: Alumni = {
        first: values.first,
        last: values.last,
        major: values.major,
        degree: values.degree,
        gradYear: values.gradYear,
        country: countryCode,
        address,
        title: values.title,
        imageUrl: values.imageUrl,
        details: values.details,
      };

      console.log("Alumni Data:", alumniData);
      console.log(
        "City Coordinates:",
        selectedCityFeature
          ? {
              lng: selectedCityFeature.lng,
              lat: selectedCityFeature.lat,
            }
          : "City not found",
      );

      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(alumniData, null, 2)}
          </code>
        </pre>,
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="first"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Micheal" type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="last"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Johnston" type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="major"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Major</FormLabel>
              <FormControl>
                <Input
                  placeholder="Technology Leadership and Innovation"
                  type="text"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree</FormLabel>
                  <FormControl>
                    <Input placeholder="B.S. OLS" type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6 flex">
            <FormField
              control={form.control}
              name="gradYear"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Graduation Year</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? graduationYears.find(
                                (year) => year === field.value,
                              )
                            : "Select Graduation Year"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search framework..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No Years found.</CommandEmpty>
                          <CommandGroup>
                            {graduationYears.map((year) => (
                              <CommandItem
                                value={year}
                                key={year}
                                onSelect={() => {
                                  form.setValue("gradYear", year);
                                }}
                              >
                                {year}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    year === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select the year you graduated
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedCountry(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map(({ code, name }) => (
                    <SelectItem key={code} value={code}>
                      {name || code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>To show the Pin for your city</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State / Province</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedState(value);
                }}
                defaultValue={field.value}
                disabled={!selectedCountry}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        selectedCountry
                          ? "Select State/Province"
                          : "Select Country First"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectedCountry &&
                    statesByCountry[selectedCountry]?.map(({ code, name }) => (
                      <SelectItem key={code} value={code}>
                        {name || code}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the State or Province of your country
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!selectedCountry || !selectedState}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !selectedCountry
                          ? "Select Country First"
                          : !selectedState
                            ? "Select State/Province First"
                            : "Select your City"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectedCountry &&
                    selectedState &&
                    citiesByState[`${selectedCountry}-${selectedState}`]?.map(
                      (city) => (
                        <SelectItem
                          key={city.properties?.geoname_id}
                          value={city.properties?.name}
                        >
                          {city.properties?.name}
                        </SelectItem>
                      ),
                    )}
                </SelectContent>
              </Select>
              <FormDescription>
                Select The City to drop the pin on the globe
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Board President" type="text" {...field} />
              </FormControl>
              <FormDescription>Title of current job</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Image</FormLabel>
              <FormControl>
                <FileUploader
                  value={files}
                  onValueChange={(newFiles) => {
                    setFiles(newFiles);
                    if (newFiles && newFiles.length > 0) {
                      field.onChange(`people/images/${newFiles[0].name}`);
                    }
                  }}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-2"
                >
                  <FileInput
                    id="fileInput"
                    className="outline-dashed outline-1 outline-slate-500"
                  >
                    <div className="flex items-center justify-center flex-col p-8 w-full ">
                      <CloudUpload className="text-gray-500 w-10 h-10" />
                      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>
                        &nbsp; or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF
                      </p>
                    </div>
                  </FileInput>
                  <FileUploaderContent>
                    {files &&
                      files.length > 0 &&
                      files.map((file, i) => (
                        <FileUploaderItem key={i} index={i}>
                          <Paperclip className="h-4 w-4 stroke-current" />
                          <span>{file.name}</span>
                        </FileUploaderItem>
                      ))}
                  </FileUploaderContent>
                </FileUploader>
              </FormControl>
              <FormDescription>Your latest professional Image</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <RichTextEditor {...field} />
              </FormControl>
              <FormDescription>Add your short Bio</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="secondary" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
