"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, set } from "date-fns";
import { BookA, CalendarIcon, ChevronsRightLeft } from "lucide-react";

import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import {
  BookAdventure,
  Package,
  postAdventureReqGuide,
} from "@/api/adventures";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/reducer";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Guide } from "@/api/guide-requests";

const bookingFormSchema = z.object({
  noOfPeople: z.string().min(1, "Number of people must be at least 1"),
  guideId: z.string().nonempty("A guide must be selected"),
});
const FormSchema = z.object({
  startDate: z.date({
    required_error: "start date is required",
  }),
});

export function PickDate({
  id,
  currentPackage,
}: {
  id: string;
  currentPackage: Package;
}) {
  const route = useRouter();
  const [startDate, setStartDate] = useState<string>("");
  const [currentState, setCurrentState] = useState<"date" | "guide">("date");
  const [guides, setGuides] = useState<Guide[]>([]);

  const bookingForm = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      guideId: guides[0]?._id,
      noOfPeople: "1",
    },
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { accessToken } = useSelector((state: RootState) => state.auth);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // Creating a Date object
    const date = new Date(data.startDate);

    // Extracting year, month, and day values
    const year = date.getFullYear();
    // JavaScript months are zero-based, so we add 1 to get the correct month
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Forming the yyyy-mm-dd format
    const formattedDate = `${year}-${month}-${day}`;
    setStartDate(formattedDate);
    const avai = await postAdventureReqGuide(id, accessToken, formattedDate);
    setGuides(avai);
    setCurrentState("guide");
    form.reset();
  }

  const onGuideSubmit = async (data: z.infer<typeof bookingFormSchema>) => {
    const booking = await BookAdventure(
      id,
      currentPackage._id,
      data.guideId,
      startDate,
      parseInt(data.noOfPeople),
      accessToken
    );
    if (booking) {
      toast({
        title: "Booking Successful",
        description: "You have successfully booked the adventure",
      });
      console.log(booking);

      route.push(`/booking/${booking._id}`);
    }
  };

  return (
    <>
      {currentState == "date" ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    We will use this date for your adventure
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Next</Button>
          </form>
        </Form>
      ) : (
        <Form {...bookingForm}>
          <form
            onSubmit={bookingForm.handleSubmit(onGuideSubmit)}
            className="space-y-8"
          >
            <FormField
              control={bookingForm.control}
              name="noOfPeople"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Number of People</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter number of people"
                      {...field}
                      type="number"
                    />
                  </FormControl>
                  <FormDescription>
                    How many people are going on this adventure?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={bookingForm.control}
              name="guideId"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Select Your Guide</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      className="flex flex-col space-y-1"
                    >
                      {guides.map((guide) => {
                        return (
                          <FormItem
                            className="flex items-center space-x-3 space-y-0"
                            key={guide._id}
                          >
                            <FormControl>
                              <RadioGroupItem value={guide._id} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {guide.username}{" "}
                              <span
                                className={`text-[10px] ${
                                  guide.isAvailable
                                    ? "text-green-400"
                                    : "text-red-500"
                                }`}
                              >
                                {guide.isAvailable
                                  ? "available"
                                  : "unavailable"}
                              </span>
                            </FormLabel>
                          </FormItem>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )}
    </>
  );
}
