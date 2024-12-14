import { useTranslation } from "react-i18next";
import { useAISpeech } from "@/contexts/ai-speech-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const AITranscript = () => {
  const { t } = useTranslation();
  const { currentTranscript } = useAISpeech();
  return (
    <Card className="p-4 bg-primary rounded-tl-none rounded-b-2xl rounded-tr-2xl">
      <CardHeader className="p-0"></CardHeader>
      <CardContent className="p-0 flex justify-center items-center">
        <p className="text-justify text-2xl text-white font-semibold">
          {currentTranscript || t("aitranscript.chat")}
        </p>
      </CardContent>
    </Card>
  );
};

export default AITranscript;
