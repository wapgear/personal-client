import { Box, CircularProgress, IconButton, InputBase, Paper, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h2">TON Checker</Typography>
      <Typography variant="h6">Not sure who sent you money or you feel that it may be a SCAM?</Typography>

      <Box sx={{ pt: 2, width: 'min(528px, 100%)' }}>
        <InputElement />
      </Box>
    </Box>
  );
};

const InputElement = () => {
  const navigate = useNavigate();

  const {
    register,
    formState: {
      isSubmitting,
      errors: { search: searchErrors },
    },
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      search: '',
    },
  });

  const onSubmit = (data: { search: string }) => {
    return navigate(`./${data.search}`);
  };

  return (
    <>
      <Paper
        component="form"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderColor: searchErrors ? 'red' : '#1e1e1e',
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Ton Wallet"
          {...register('search', {
            validate: (value) => {
              if (!value) {
                return 'Please enter a wallet address';
              }
              if (!value.endsWith('.ton')) {
                if (value.length !== 48) {
                  return 'Invalid wallet address';
                }
              }
            },
          })}
        />
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          {isSubmitting ? <CircularProgress size="24px" /> : <SearchIcon />}
        </IconButton>
      </Paper>
      <Box
        sx={{
          pl: 2,
          minHeight: '40px',
        }}
      >
        <Typography variant="caption" sx={{ color: 'red' }}>
          {searchErrors?.message}
        </Typography>
      </Box>
    </>
  );
};
