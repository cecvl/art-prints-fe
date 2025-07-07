import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

export function MainNav() {
  return (
    <div className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="relative px-6 py-4 max-w-7xl mx-auto">
        <NavigationMenu>
          <NavigationMenuList className="flex gap-6 items-center">
            {/* Home */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/" className="text-sm font-medium hover:underline">
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Account Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm font-medium">
                Account
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-4 w-40">
                <ul className="space-y-2">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/signin"
                        className="block text-sm hover:underline"
                      >
                        Sign In
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Join Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm font-medium">
                Join ArtPrints Kanairo
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-4 w-52">
                <ul className="space-y-2">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/signup?type=artist"
                        className="block text-sm hover:underline"
                      >
                        Sign up as Artist
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/signup?type=printshop"
                        className="block text-sm hover:underline"
                      >
                        Sign up as Print Shop
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
