import Link from "next/link";
import FullscreenToggleButton from "../others/FullscreenToggleButton";
import { ArrowLeftIcon } from "lucide-react";
import { UserTools } from "../others/UserTools";

export default function DashboardHeader() {
  return (
    <nav className=" w-full bg-[#fcfcfc] border-b ">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="pl-12">
            <Link
              href="/"
              className="rounded-md border flex items-center gap-2  px-3 py-2  ml-5 font-medium text-gray-500 hover:bg-gray-100  duration-200  "
              aria-current="page"
            >
              <ArrowLeftIcon className="w-[22px] h-[22px]" />
              Accueil
            </Link>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center gap-5 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <FullscreenToggleButton />
            <UserTools/>
          </div>
        </div>
      </div>
    </nav>
  );
}

{
  /* <div
className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-hidden"
role="menu"
aria-orientation="vertical"
aria-labelledby="user-menu-button"
tabIndex={-1}
> */
}
{
  /* Active: "bg-gray-100 outline-hidden", Not Active: "" */
}
{
  /* <a
  href="#"
  className="block px-4 py-2 text-sm text-gray-700"
  role="menuitem"
  tabIndex={-1}
  id="user-menu-item-0"
>
  Your Profile
</a>
<a
  href="#"
  className="block px-4 py-2 text-sm text-gray-700"
  role="menuitem"
  tabIndex={-1}
  id="user-menu-item-1"
>
  Settings
</a>
<a
  href="#"
  className="block px-4 py-2 text-sm text-gray-700"
  role="menuitem"
  tabIndex={-1}
  id="user-menu-item-2"
>
  Sign out
</a>
</div> */
}
