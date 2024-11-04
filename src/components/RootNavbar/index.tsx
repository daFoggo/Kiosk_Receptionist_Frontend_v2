import { Card, CardContent } from "../ui/card";

import logoPtit from "@/assets/logo/logo-ptit.png";
import logoRipt from "@/assets/logo/logo-ript.png";
const RootNavbar = () => {
  return (
    <Card className="w-full rounded-3xl">
      <CardContent className="flex justify-between items-center p-4">
        <img src={logoPtit} alt="logo ptit" className="h-12" />
        <div className="text-xl text-center">
          <h1 className="font-bold text-[#d82221]">
            Học viện Công nghệ Bưu chính Viễn thông
          </h1>
          <p className="font-semibold text-[#051a53]">
            Viện Khoa học Kỹ thuật Bưu điện
          </p>
        </div>
        <img src={logoRipt} alt="logo ript" className="h-12" />
      </CardContent>
    </Card>
  );
};

export default RootNavbar;
