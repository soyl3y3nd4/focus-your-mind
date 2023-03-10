import React, { useContext, useEffect, useState } from 'react';

import validator from 'validator';

import { Alert, IconButton, List, ListItem, ListItemText, Snackbar, Tooltip, Typography } from '@mui/material'
import { InputBase } from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { LanguageContext } from '../../../contexts/LanguageContext/LanguageContext';

export const BlackList = () => {
  const { tr } = useContext(LanguageContext);

  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  const [blackListItems, setBlackListItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSyncStorageStatus();
  }, []);

  const checkSyncStorageStatus = async () => {
    const { blacklist = [] } = await chrome.storage.sync.get(null);

    setBlackListItems(blacklist);
    setIsLoading(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const onFormSubmit = async () => {
    if (value.length === 0 || !validator.isURL(value)) {
      setMessage('You must introduce a valid URL');
      return;
    }

    const parsedURL = new URL(value).host;
    if (blackListItems.includes(parsedURL)) {
      setMessage('The URL already exists');
      return;
    }

    const newValues = [...blackListItems, parsedURL];
    setBlackListItems(newValues);
    await chrome.storage.sync.set({ blacklist: newValues });

    setValue('');
    setMessage('');
  };

  const handleRemoveItem = async (item: string) => {
    const updatedItems = blackListItems.filter(it => it !== item);
    setBlackListItems(updatedItems);
    await chrome.storage.sync.set({ blacklist: updatedItems });
  };

  return (
    <div className="blacklist__container">
      <Typography variant="h6" sx={{ fontFamily: "'VT323', monospace", textAlign: 'center', color: '#fff', animation: 'fadeIn 0.3s' }}>
        {tr('Blacklist')}
      </Typography>

      <div className="blacklist__form" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <InputBase
          type="url"
          value={value}
          onChange={handleInputChange}
          sx={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '0 0.4rem', fontFamily: "'VT323', monospace", color: 'rgba(0, 0, 0, 0.7)', '::placeholder': { color: 'rgba(0, 0, 0, 0.3)' } }}
          placeholder={tr("https://website-to-block.com")}
        />

        <Tooltip title={tr("Add URL")}>
          <IconButton type="submit" disabled={value.length === 0 || false} size="small" onClick={onFormSubmit} sx={{ color: 'white', animation: 'fadeIn 0.3s' }}>
            <KeyboardReturnIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

      <List
        sx={{
          width: '100%',
          maxWidth: 367,
          bgcolor: 'rgba(255, 255, 255, 0.7)',
          position: 'relative',
          overflow: 'auto',
          maxHeight: 236,
          height: 159,
          marginTop: '0.4rem',
          '& ul': { padding: 0 },
          animation: 'fadeIn 0.3s',
        }}
        subheader={<li />}
      >
        {!isLoading && (
          <>
            {
              blackListItems.length > 0 && blackListItems.map((item, i) => (
                <ListItem key={`item-${item}-${i}`} sx={{ padding: '0 12px', animation: 'fadeIn 0.3s' }}>
                  <ListItemText primary={item} sx={{ '& span': { fontFamily: "'VT323', monospace" }, animation: 'fadeIn 0.3s' }} />
                  <Tooltip title={tr("Delete URL")}>
                    <IconButton type="submit" size="small" onClick={() => handleRemoveItem(item)} sx={{ color: 'rgb(205 5 5)', animation: 'fadeIn 0.3s' }}>
                      <RemoveCircleOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))
            }
            {
              blackListItems.length === 0 && (
                <ListItem key={`item-$1`} sx={{ padding: '0 12px', animation: 'fadeIn 0.3s' }}>
                  <ListItemText primary={tr('There are not URLs added')} sx={{ '& span': { fontFamily: "'VT323', monospace" }, animation: 'fadeIn 0.3s' }} />
                </ListItem>
              )
            }
          </>
        )}
      </List>

      <Snackbar open={message.length > 0} autoHideDuration={3000} onClose={() => setMessage('')}>
        <Alert onClose={() => setMessage('')} severity="error" variant="filled" sx={{ width: '100%', fontFamily: "'VT323', monospace" }}>
          {tr(message)}
        </Alert>
      </Snackbar>
    </div>
  );
};
