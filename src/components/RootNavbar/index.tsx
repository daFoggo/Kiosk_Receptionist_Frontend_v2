import logoPtit from "@/assets/logo/logo-ptit.png";
import logoRipt from "@/assets/logo/logo-ript.png";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const RootNavbar = () => {
  const { t } = useTranslation();

  return (
    <Card className="w-full rounded-3xl">
      <CardContent className="flex justify-between items-center p-4">
        <img src={logoPtit} alt="logo ptit" className="h-12" />
        <div className="text-xl text-center">
          <h1 className="font-bold text-[#d82221]">{t("school.name")}</h1>
          <p className="font-semibold text-[#051a53]">{t("institute.name")}</p>
        </div>
        <img src={logoRipt} alt="logo ript" className="h-12" />
      </CardContent>
    </Card>
  );
};

export default RootNavbar;
