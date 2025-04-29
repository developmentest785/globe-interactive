"use client";

import partnerLogo from "@/assets/partner-logo.webp";
import { createFileRoute } from "@tanstack/react-router";

import { RichTextEditor } from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Alumni } from "@/data/mockAlumni";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Feature } from "geojson";
import { Check, ChevronsUpDown, CloudUpload, Paperclip } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

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
  details: z.string().min(25).max(1000),
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
  //
  // // Use React Query to fetch and process GeoJSON data
  // const {
  //   data: geoData,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["geoData"],
  //   queryFn: async () => {
  //     const data = await loadGeoJSON();
  //     return processGeoJSON(data);
  //   },
  // });
  //
  // // Show error toast if query fails
  // useEffect(() => {
  //   if (error) {
  //     toast.error("Failed to load location data. Please try again later.");
  //   }
  // }, [error]);

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first: "",
      last: "",
      major: "",
      degree: "",
      title: "",
      country: "",
      state: "",
      city: "",
      gradYear: new Date().getFullYear().toString(),
      imageUrl: "",
      details: "",
    },
  });

  // Use the processed data directly
  // const { countries, statesByCountry, citiesByState } = geoData || {
  //   countries: [],
  //   statesByCountry: {},
  //   citiesByState: {},
  // };

  // Reset state and city when country changes
  // useEffect(() => {
  //   if (selectedCountry !== form.getValues("country")) {
  //     form.setValue("state", "");
  //     form.setValue("city", "");
  //     setSelectedState("");
  //   }
  // }, [form.getValues("country")]);
  //
  // // Reset city when state changes
  // useEffect(() => {
  //   if (selectedState !== form.getValues("state")) {
  //     form.setValue("city", "");
  //   }
  // }, [form.getValues("state")]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      // Find the selected city coordinates
      const countryCode = selectedCountry;
      const stateCode = selectedState;
      // const countryStateKey = `${countryCode}-${stateCode}`;

      // const selectedCityFeatures = citiesByState[countryStateKey]?.filter(
      //   (city) => city.properties?.name === values.city,
      // );
      //
      // const selectedCityFeature = selectedCityFeatures?.[0] as unknown as
      //   | GeoJSONFeature
      //   | undefined;

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
      //
      // console.log("Alumni Data:", alumniData);
      // console.log(
      //   "City Coordinates:",
      //   selectedCityFeature
      //     ? {
      //         lng: selectedCityFeature.lng,
      //         lat: selectedCityFeature.lat,
      //       }
      //     : "City not found",
      // );

      toast(
        <pre className="mt-2 w-[340px] rounded-md text-wrap p-4">
          <code>{JSON.stringify(alumniData, null, 2)}</code>
        </pre>,
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <div className="relative flex flex-col items-center border-12 border-[#CFB991] bg-black text-white">
      <div></div>
      <div className="fixed pointer-events-none top-0 left-0 right-0 z-20 flex justify-between items-start p-6">
        <div className="fixed pointer-events-none top-3 left-12 z-0 w-42 h-42 after:bg-[#CFB991] after:content-[''] after:absolute after:inset-0 after:rounded-full after:-left-9 after:top-0 after:w-20 after:h-20">
          <div className="flex items-center justify-center text-white  relative w-full h-full rounded-full bg-[#CFB991]"></div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 323 256"
          className="w-32 relative z-50 ml-11 mt-2"
        >
          <path
            fill="#fff"
            d="m168.525 124.849 15.693-36.817h25.972c37.591 0 51.854-15.436 61.717-38.614 3.651-8.574 9.764-22.937 1.664-35.154C265.47 2.047 248.521.708 236.396.708H98.341L78.873 46.449h24.991l-13.906 32.65h-25.04L45.44 124.85h123.085Z"
          />
          <path
            fill="#050917"
            d="M266.527 18.936c-4.391-6.653-13.972-9.747-30.131-9.747H103.955L91.713 37.95h24.95l-21.1 49.632h-25.04l-12.25 28.792h104.663l12.242-28.792h-25.374l3.427-8.042h56.96c36.642 0 46.414-15.802 53.916-33.44 4.033-9.498 7.543-19.412 2.42-27.163Zm-95.59 19.012h41.832c5.771 0 4.94 2.894 4.158 4.69a14.101 14.101 0 0 1-13.398 8.134h-38.048l5.456-12.824Z"
          />
          <path
            fill="#CFB991"
            d="M236.396 13.608h-129.53l-8.491 19.96h24.991L98.483 91.99H73.442l-8.5 19.96h95.083l8.5-19.96h-25.391l7.186-16.866h59.879c34.322 0 42.955-14.537 49.899-30.77 6.944-16.235 10.67-30.772-23.652-30.772m-32.842 41.583h-44.743l9.214-21.623h44.743c7.918 0 11.111 4.066 8.242 10.811a18.308 18.308 0 0 1-17.465 10.812"
          />
          <path
            fill="#fff"
            d="m6.542 170.657-5.808-1.692v-4.191h22.69c14.776 0 20.233 4.722 20.233 15.882 0 10.437-5.963 15.851-17.641 15.851h-9.178v16.714l5.882 1.692v3.901H.586v-3.901l5.956-1.692v-42.564Zm10.296-.185v20.874l10.807-.802c2.686-1.234 5.457-2.858 5.457-9.598 0-5.092-.24-10.493-10.123-10.493l-6.141.019Zm111.121 25.331h-7.321v17.418l5.876 1.692v3.901h-22.14v-3.901l5.956-1.692v-42.589l-5.882-1.691v-4.167h23.69c14.042 0 19.134 4.982 19.134 14.555 0 7.407-2.889 11.252-9.555 13.9l10.018 19.554 6.462 2.13v3.9h-15.042l-11.196-23.01Zm-7.321-25.294v20.584l10.938-.734c3.475-1.722 5.147-4.475 5.147-10.147 0-5.951-1.925-9.703-8.098-9.703h-7.987Zm37.966 44.404 5.858-1.618v-42.638l-5.808-1.692v-4.191h26.177c14.777 0 23.399 8.907 23.399 26.431 0 19.819-8.943 27.609-24.529 27.609h-25.097v-3.901Zm16.252-44.404v42.712h7.734c5.315 0 14.468-.858 14.468-20.368 0-15.363-2.759-22.351-14.468-22.351l-7.734.007ZM23.454 246.965c0 6.567-3.802 8.981-10.024 8.981-6.221 0-10.024-3.704-10.024-8.981v-13.172l-2.82-.883v-2.469h11.517v2.469l-2.783.883v13.172c0 3.395 1.302 5.247 5.005 5.247 1.815 0 4.883-.568 4.883-5.42v-12.999l-2.821-.883v-2.469h9.876v2.469l-2.82.883.011 13.172Zm19.863-6.784v12.086l2.784.851v2.469h-9.716v-2.469l2.852-.851V235.12l-1.235-1.525-1.685-.525v-2.641h6.364l12.265 15.431v-12.067l-2.821-.846v-2.518h9.715v2.518l-2.815.846v21.813H55.73l-12.413-15.425Zm39.521 12.086 2.821.851v2.469H74.104v-2.469l2.821-.851v-18.518l-2.82-.851v-2.469h11.554v2.469l-2.82.851v18.518Zm155.563 0 2.821.851v2.469h-11.549v-2.469l2.815-.851v-18.518l-2.815-.851v-2.469h11.549v2.469l-2.821.851v18.518Zm-126.312 3.308h-5.431l-7.987-21.782-2.821-.883v-2.469h12.166v2.469l-2.858.883 5.302 15.493 5.401-15.493-2.821-.883v-2.469h9.876v2.469l-2.821.883-8.006 21.782Zm22.875-21.782-2.821-.846v-2.518h19.752l.222 7.746h-3.154l-1.531-4.432h-6.555v7.086h6.524v3.568h-6.524v7.975h6.691l2.006-4.408h3.086l-.444 7.636h-20.073v-2.469l2.821-.704v-18.634Zm41.287 11.517h-2.141v6.957l2.82.851v2.469h-11.548v-2.469l2.821-.851v-18.474l-2.821-.846v-2.518h11.48c7.037 0 9.21 2.722 9.21 6.968a6.03 6.03 0 0 1-4.068 6.58l4.061 8.197 3.531 1.086v2.315h-8.518l-4.827-10.265Zm-2.141-11.517v8.801l3.975-.339a5.28 5.28 0 0 0 1.975-4.382c0-2.519-.667-4.08-3.247-4.08h-2.703Zm25.695 13.967h3.494l.747 3.531a10.162 10.162 0 0 0 5.308 1.463c.272.006.544-.006.815-.037a3.794 3.794 0 0 0 1.561-3.025c0-5.876-12.03-3.259-12.03-11.857 0-3.938 3.605-7.709 9.586-7.709 2.377.051 4.712.642 6.827 1.728v6.629h-3.296l-1.191-4.215a11.541 11.541 0 0 0-4.074-.815 4.167 4.167 0 0 0-.679.037 3.467 3.467 0 0 0-1.667 2.957c0 5.024 11.925 3.221 11.925 11.653 0 4.549-4.11 7.814-9.647 7.814a14.267 14.267 0 0 1-7.648-2.277l-.031-5.877Zm61.366-13.906h-3.259l-1.481 4.457h-3.154v-7.882h21.912v7.882h-3.087l-1.475-4.457h-3.537v18.437l2.821.852v2.469h-11.554v-2.469l2.814-.852v-18.437Zm33.714 12.037-6.592-12.098-2.821-.883v-2.469h12.166v2.469l-2.852.883 4.142 8.191 4.178-8.191-2.82-.883v-2.469h9.925v2.469l-2.821.883-6.629 12.03v6.444l2.821.852v2.469h-11.549v-2.469l2.852-.852v-6.376Zm10.635-42.738-3.828 10.075h-16.918v-19.443h9.586l1.235 5.444h4.257v-16.376h-4.257l-1.235 5.253h-9.586v-17.599h16.185l3.086 10.439h5.825l-.362-16.172h-40.912v4.191l5.808 1.691v42.639l-5.882 1.617v3.902h41.786l.958-15.661h-5.746Zm-211.59-2.924c0 13.708-6.542 19.393-19.961 19.393-12.345 0-21.282-4.938-21.282-17.961v-31.004l-5.883-1.692v-4.191h22.06v4.191l-5.882 1.692v31.004c0 7.795 3.599 11.215 12.203 11.215 5.938 0 11.394-3.475 11.394-11.931v-30.288l-5.808-1.692v-4.191h19.041v4.191l-5.882 1.692v29.572Zm164.149 0c0 13.708-6.543 19.393-19.956 19.393-12.344 0-21.288-4.938-21.288-17.961v-31.004l-5.882-1.692v-4.191h22.06v4.191l-5.883 1.692v31.004c0 7.795 3.605 11.215 12.203 11.215 5.938 0 11.394-3.475 11.394-11.931v-30.288l-5.808-1.692v-4.191h19.042v4.191l-5.882 1.692v29.572Zm58.971 55.272a5.39 5.39 0 1 1 5.388-5.389 5.397 5.397 0 0 1-5.388 5.389Zm0-9.66a4.265 4.265 0 0 0-3.946 2.637 4.27 4.27 0 0 0 7.497 4.007 4.273 4.273 0 0 0-3.551-6.644Z"
          />
          <path
            fill="#fff"
            d="M316.364 250.606v2h-1.055v-5h2.228c1.086 0 1.679.618 1.679 1.371a1.233 1.233 0 0 1-.728 1.185c.247.092.617.346.617 1.234v.247a3.66 3.66 0 0 0 .074.951h-1.025a3.577 3.577 0 0 1-.105-1.124v-.074c0-.543-.135-.802-.938-.802l-.747.012Zm0-.864h.908c.617 0 .821-.228.821-.617s-.266-.617-.797-.617h-.932v1.234Z"
          />
        </svg>
      </div>

      <div className="fixed bottom-3 right-8 z-50 w-26 h-26">
        <div className="flex items-center justify-center text-white relative w-full h-full bg-[#CFB991] rounded-full after:bg-[#CFB991] after:absolute after:rounded-full after:-right-5 after:bottom-0 after:w-10 after:h-10">
          <div className="flex flex-col items-center gap-0 px-2 relative z-10">
            <span className="text-xs font-bold">Powered by</span>
            <div className="flex items-center">
              <img
                src={partnerLogo}
                alt="Partner Logo"
                className="w-20 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "space-y-8 max-w-3xl mx-auto py-10 px-10 my-10 rounded-sm",
            "bg-gradient-to-br from-gray-100/20 via-[#CFB991]/20 to-gray-100/20 bg-opacity-80 backdrop-blur-md border-orange-100/20 border",
          )}
        >
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="first"
                render={({ field: { ref, ...rest } }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Micheal" type="text" {...rest} />
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
                render={({ field: { ref, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Johnston" type="text" {...rest} />
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
            render={({ field: { ref, ...rest } }) => (
              <FormItem>
                <FormLabel>Major</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Technology Leadership and Innovation"
                    type="text"
                    {...rest}
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
                render={({ field: { ref, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="B.S. OLS" type="text" {...rest} />
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
                render={({ field: { ref, ...rest } }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Graduation Year</FormLabel>
                    <Popover>
                      <FormControl>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[200px] justify-between text-black",
                              !rest.value && "text-muted-foreground",
                            )}
                          >
                            {rest.value
                              ? graduationYears.find(
                                  (year) => year.toString() === rest.value,
                                )
                              : "Select Graduation Year"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-[200px] bg-black text-white p-0">
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
                                      year.toString() === rest.value
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
            render={({ field: { ref, ...rest } }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>

                <Input placeholder="Input your country" type="text" {...rest} />
                <FormDescription>To show the Pin for your city</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field: { ref, ...rest } }) => (
              <FormItem>
                <FormLabel>State / Province</FormLabel>

                <Input placeholder="Stat / Prince code" type="text" {...rest} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field: { ref, ...rest } }) => (
              <FormItem>
                <FormLabel>City</FormLabel>

                <Input
                  placeholder="Input your city name"
                  type="text"
                  {...rest}
                />
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
            render={({ field: { ref, ...rest } }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Board President" type="text" {...rest} />
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
                <FormDescription>
                  Your latest professional Image
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details"
            render={({ field: { ref, ...rest } }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <RichTextEditor value={rest.value} onChange={rest.onChange} />
                </FormControl>
                <FormDescription>Add your short Bio</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button variant="default" size="lg" className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
