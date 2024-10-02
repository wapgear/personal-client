import { Box, Button, Paper, Snackbar, styled, Tooltip, Typography } from "@mui/material";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useCallback, useState } from "react";
import { useBreakpointUtils } from "../../../utils/breakpoints.ts";
import { Toggle } from "./Dashboard.toggle.tsx";
import { useDashboardStore } from "../../../store.ts";

export const DashboardLayoutV3Sidebar = () => {
  // const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();
  const { isMobile } = useBreakpointUtils();
  const { account } = useDashboardStore();

  const [isShowCopied, setIsShowCopied] = useState(false);

  console.log("account", tonConnectUI);

  const onCopyAddress = useCallback(async () => {
    await navigator.clipboard.writeText(address);
    setIsShowCopied(true);
  }, [address]);

  return (
    <>
      <Snackbar
        open={isShowCopied}
        autoHideDuration={3000}
        onClose={() => setIsShowCopied(false)}
        message="Address copied"
      />
      <Container>
        <Box>
          <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Wallet</Typography>
            {isMobile && <Toggle />}
          </Box>
          <Paper>
            <Box
              sx={{
                p: 2,
                gap: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              }}
            >
              <Typography variant="body1">Hey, {account?.name ?? "There"}</Typography>
              <Typography
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  cursor: "pointer"
                }}
                variant="body2"
                onClick={onCopyAddress}
              >
                Address:{" "}
                <Tooltip title={address}>
                  <>{address}</>
                </Tooltip>
              </Typography>
            </Box>
          </Paper>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => tonConnectUI.disconnect()}
            fullWidth
            size="small"
          >
            Disconnect
          </Button>
        </Box>
      </Container>
    </>
  );
};

const Container = styled("div")(({ theme }) => ({
  padding: `${theme.spacing(2)}`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  height: "100%",
  ["& > *"]: {
    width: "100%"
  }
}));
