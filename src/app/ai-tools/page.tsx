
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SymptomCheckerForm from '@/components/ai/SymptomCheckerForm';
import TreatmentPlannerForm from '@/components/ai/TreatmentPlannerForm';
import DentalCareTipsForm from '@/components/ai/DentalCareTipsForm';
import OralHealthAssessmentForm from '@/components/ai/OralHealthAssessmentForm';
import EmergencyDentalAdvisorForm from '@/components/ai/EmergencyDentalAdvisorForm';
import SmileDesignPreviewForm from '@/components/ai/SmileDesignPreviewForm';
import DentalInsuranceHelperForm from '@/components/ai/DentalInsuranceHelperForm';
import PostTreatmentCareGuideForm from '@/components/ai/PostTreatmentCareGuideForm'; // Added import
import { Activity, ClipboardList, Lightbulb, SmilePlus, AlertTriangle, Sparkles, ShieldCheck, BookHeart } from 'lucide-react'; // Added BookHeart

export default function AiToolsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-semibold text-foreground">AI Dental Assistant</h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          Explore our AI-powered tools designed to assist you with your dental health. 
          Please remember these tools provide preliminary information and do not replace professional dental advice.
        </p>
      </div>

      <Tabs defaultValue="symptom-checker" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-2 h-auto p-2"> {/* Adjusted grid columns for 8 items */}
          <TabsTrigger value="symptom-checker" className="flex flex-col sm:flex-row items-center gap-2 py-2 text-xs sm:text-sm h-auto data-[state=active]:shadow-md">
            <Activity className="h-5 w-5 mb-1 sm:mb-0" /> Symptom Checker
          </TabsTrigger>
          <TabsTrigger value="treatment-planner" className="flex flex-col sm:flex-row items-center gap-2 py-2 text-xs sm:text-sm h-auto data-[state=active]:shadow-md">
            <ClipboardList className="h-5 w-5 mb-1 sm:mb-0" /> Treatment Planner
          </TabsTrigger>
          <TabsTrigger value="dental-care-tips" className="flex flex-col sm:flex-row items-center gap-2 py-2 text-xs sm:text-sm h-auto data-[state=active]:shadow-md">
            <Lightbulb className="h-5 w-5 mb-1 sm:mb-0" /> Dental Care Tips
          </TabsTrigger>
          <TabsTrigger value="oral-health-assessment" className="flex flex-col sm:flex-row items-center gap-2 py-2 text-xs sm:text-sm h-auto data-[state=active]:shadow-md">
            <SmilePlus className="h-5 w-5 mb-1 sm:mb-0" /> Oral Health Assessment
          </TabsTrigger>
          <TabsTrigger value="emergency-advisor" className="flex flex-col sm:flex-row items-center gap-2 py-2 text-xs sm:text-sm h-auto data-[state=active]:shadow-md">
            <AlertTriangle className="h-5 w-5 mb-1 sm:mb-0" /> Emergency Advisor
          </TabsTrigger>
          <TabsTrigger value="smile-design-preview" className="flex flex-col sm:flex-row items-center gap-2 py-2 text-xs sm:text-sm h-auto data-[state=active]:shadow-md">
            <Sparkles className="h-5 w-5 mb-1 sm:mb-0" /> Smile Design
          </TabsTrigger>
          <TabsTrigger value="insurance-helper" className="flex flex-col sm:flex-row items-center gap-2 py-2 text-xs sm:text-sm h-auto data-[state=active]:shadow-md">
            <ShieldCheck className="h-5 w-5 mb-1 sm:mb-0" /> Insurance Helper
          </TabsTrigger>
          <TabsTrigger value="post-treatment-care" className="flex flex-col sm:flex-row items-center gap-2 py-2 text-xs sm:text-sm h-auto data-[state=active]:shadow-md"> {/* Added new tab trigger */}
            <BookHeart className="h-5 w-5 mb-1 sm:mb-0" /> Post-Treatment Care
          </TabsTrigger>
        </TabsList>
        <TabsContent value="symptom-checker" className="mt-6">
          <SymptomCheckerForm />
        </TabsContent>
        <TabsContent value="treatment-planner" className="mt-6">
          <TreatmentPlannerForm />
        </TabsContent>
        <TabsContent value="dental-care-tips" className="mt-6">
          <DentalCareTipsForm />
        </TabsContent>
        <TabsContent value="oral-health-assessment" className="mt-6">
          <OralHealthAssessmentForm />
        </TabsContent>
        <TabsContent value="emergency-advisor" className="mt-6">
          <EmergencyDentalAdvisorForm />
        </TabsContent>
        <TabsContent value="smile-design-preview" className="mt-6">
          <SmileDesignPreviewForm />
        </TabsContent>
        <TabsContent value="insurance-helper" className="mt-6">
          <DentalInsuranceHelperForm />
        </TabsContent>
        <TabsContent value="post-treatment-care" className="mt-6"> {/* Added new tab content */}
          <PostTreatmentCareGuideForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

