import { IAITranscriptProps } from "@/models/AITranscript/type";
import { Card, CardContent, CardHeader } from "../ui/card";

const AITranscript = ({ transcript }: IAITranscriptProps) => {
  return (
    <Card className="p-4 bg-primary rounded-tl-none rounded-b-2xl rounded-tr-2xl">
      <CardHeader className="p-0"></CardHeader>
      <CardContent className="p-0 flex justify-center items-center">
        <p className="text-justify text-2xl text-white font-semibold">
          {transcript}
        </p>
      </CardContent>
    </Card>
  );
};

export default AITranscript;
