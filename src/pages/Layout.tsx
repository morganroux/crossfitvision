"use client";

import {
  Close,
  Inbox,
  Logout,
  Mail,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import theme from "@/theme";
import { NextPage } from "next";
import { signOut } from "next-auth/react";

const drawerWidth = 240;

export type NextPageWithLayout<Props = {}, InitialProps = Props> = NextPage<
  Props,
  InitialProps
> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
  public?: boolean;
};

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [open, setOpen] = useState(false);
  const toggleDrawerOpen = () => {
    // setOpen((open) => !open);
  };
  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Stack direction="row">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
              }}
            >
              {open ? <Close /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h5" noWrap>
              crossfit vision
            </Typography>
          </Stack>
          <IconButton>
            <Logout onClick={() => signOut({ callbackUrl: "/" })} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <Inbox /> : <Mail />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {["All mail", "Trash", "Spam"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <Inbox /> : <Mail />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Toolbar />
      <Box
        sx={{
          height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default DashboardLayout;
