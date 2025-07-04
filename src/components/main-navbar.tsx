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
    <NavigationMenu className="px-4 py-3 border-b shadow-sm sticky top-0 bg-white z-50">
      <NavigationMenuList className="flex gap-4">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Account</NavigationMenuTrigger>
          <NavigationMenuContent className="p-4 w-32">
            <ul className="space-y-2">
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/signin" className="block hover:underline">
                    Sign In
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Join ArtPrints Kanairo</NavigationMenuTrigger>
          <NavigationMenuContent className="p-4 w-48">
            <ul className="space-y-2">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/signup?type=artist"
                    className="block hover:underline"
                  >
                    Sign up as Artist
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/signup?type=printshop"
                    className="block hover:underline"
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
  );
}
