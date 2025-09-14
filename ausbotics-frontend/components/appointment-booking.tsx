"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";

const appointmentSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  preferredDate: z
    .string()
    .refine(
      (date) => new Date(date) >= new Date(new Date().toDateString()),
      "Please select a future date"
    ),
  preferredTime: z.string().min(1, "Preferred time is required"),
  purpose: z.string().min(1, "Purpose is required"),
  details: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export function AppointmentBooking() {
  const { bookAppointment } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
  ];

  const purposeOptions = [
    "Product Demo",
    "Consultation",
    "Integration Discussion",
    "Pricing Information",
    "Technical Support",
    "Partnership Inquiry",
    "Other",
  ];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  const onSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const success = await bookAppointment(data);
      if (success) {
        setIsSubmitted(true);
        reset();
      } else {
        setError("Failed to book appointment. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-20 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Appointment Booked!
              </h3>
              <p className="text-muted-foreground mb-6">
                Thank you for booking an appointment. We'll contact you soon to
                confirm the details.
              </p>
              <Button onClick={() => setIsSubmitted(false)} className="w-full">
                Book Another Appointment
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const selectedTime = watch("preferredTime");
  const selectedPurpose = watch("purpose");

  return (  
    <section className="py-20 bg-muted/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Book a Demo Appointment
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to see our AI calling agents in action? Schedule a
            personalized demo and discover how we can transform your customer
            communications.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Schedule Your Demo</span>
            </CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive">{error}</span>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="p-3 rounded-lg"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="p-3 rounded-lg"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="preferredDate">Preferred Date *</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="p-3 rounded-lg"
                    {...register("preferredDate")}
                  />
                  {errors.preferredDate && (
                    <p className="text-sm text-destructive">
                      {errors.preferredDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="preferredTime">Preferred Time *</Label>
                  <Select
                    value={selectedTime}
                    onValueChange={(value) => setValue("preferredTime", value)}
                  >
                    <SelectTrigger className="p-3 rounded-lg">
                      <SelectValue placeholder="Select a time">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{selectedTime || "Select a time"}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.preferredTime && (
                    <p className="text-sm text-destructive">
                      {errors.preferredTime.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="purpose">Purpose of Meeting *</Label>
                <Select
                  value={selectedPurpose}
                  onValueChange={(value) => setValue("purpose", value)}
                >
                  <SelectTrigger className="p-3 rounded-lg">
                    <SelectValue placeholder="Select the purpose of your meeting" />
                  </SelectTrigger>
                  <SelectContent>
                    {purposeOptions.map((purpose) => (
                      <SelectItem key={purpose} value={purpose}>
                        {purpose}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.purpose && (
                  <p className="text-sm text-destructive">
                    {errors.purpose.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="details">Additional Details (Optional)</Label>
                <Textarea
                  id="details"
                  placeholder="Tell us more about your needs or any specific questions you have..."
                  rows={4}
                  className="p-3 resize-none rounded-lg"
                  {...register("details")}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                    <span>Booking Appointment...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Book Demo Appointment</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
