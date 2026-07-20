import FullscreenToggleButton from "@/components/others/FullscreenToggleButton";
import { UserTools } from "@/components/others/UserTools";
import SystemPorts from "@/components/SystemPorts";
import 'animate.css';
export default async function Home() {
  return (
    <>
      <nav className=" w-full bg-[#fcfcfc] border-b ">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className=""></div>

            <div className="absolute bg inset-y-0 right-0 flex items-center gap-5 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <FullscreenToggleButton />
              <UserTools />
            </div>
          </div>
        </div>
      </nav>
      <div className=" flex flex-col items-center justify-center ">
        <h2 className="animate__animated animate__backInDown sm:text-lg text-center md:text-2xl font-bold text-[#3354f4] py-14 px-2">
          Bienvenue dans votre espace de gestion quotidienne.
        </h2>
        <SystemPorts />
      </div>
    </>
  );
}
