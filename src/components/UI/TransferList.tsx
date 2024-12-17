import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { FixedSizeList } from 'react-window';
import { Spinner } from './Spinner';
import { useTranslation } from 'react-i18next';

type TransferListProps = {
  data: string[];
  suppliersData: string[];
  setChosen: Dispatch<SetStateAction<string[]>>;
  translation: string;
};

const not = (a: string[], b: string[]) => {
  return a.filter((value) => b.indexOf(value) === -1);
};

const intersection = (a: string[], b: string[]) => {
  return a.filter((value) => b.indexOf(value) !== -1);
};

const union = (a: string[], b: string[]) => {
  return [...a, ...not(b, a)];
};

export const TransferList: React.FC<TransferListProps> = ({ data, suppliersData, setChosen, translation }) => {
  const { t } = useTranslation([translation]);
  const [checked, setChecked] = React.useState<string[]>([]);
  const [left, setLeft] = React.useState<string[]>([]);
  const [right, setRight] = React.useState<string[]>([]);
  const [init, setInit] = useState(true);

  useEffect(() => {
    if (init) {
      if (suppliersData.length > 0) {
        setRight(suppliersData);
        const data_ = data.filter((item) => !suppliersData.includes(item));
        setLeft(data_);
      } else {
        setLeft(data);
      }
      setInit(false);
    }
  }, [data, init, suppliersData]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const numberOfChecked = (items: string[]) => intersection(checked, items).length;

  const handleToggleAll = (items: string[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    const chosen = right.concat(leftChecked).sort(); //sort((a, b) => a - b);
    setRight(chosen);
    setChosen(chosen);
    setLeft(not(left, leftChecked).sort());
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    const chosen = not(right, rightChecked).sort();
    setLeft(left.concat(rightChecked).sort());
    setRight(chosen);
    setChosen(chosen);
    setChecked(not(checked, rightChecked));
  };

  const customList = (title: React.ReactNode, items: string[]) => {
    const Row =
      (props: any) =>
      ({ index, style }: any) => {
        const labelId = `${props.title ? props.title.toString() + index : index}`;
        return (
          <ListItemButton key={index} style={style} role="listitem" onClick={handleToggle(props.items[index])}>
            <ListItemIcon>
              <Checkbox
                checked={checked.indexOf(props.items[index]) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{
                  'aria-labelledby': labelId,
                }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={props.items[index]} />
          </ListItemButton>
        );
      };

    return (
      <Card>
        <CardHeader
          sx={{ px: 2, py: 1 }}
          avatar={
            <Checkbox
              onClick={handleToggleAll(items)}
              checked={numberOfChecked(items) === items.length && items.length !== 0}
              indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
              disabled={items.length === 0}
              inputProps={{
                'aria-label': 'all items selected',
              }}
            />
          }
          title={title}
          subheader={`${numberOfChecked(items)}/${items.length}`}
        />
        <Divider />
        <FixedSizeList height={360} width={360} itemSize={46} itemCount={items.length} overscanCount={5}>
          {Row({ items: items, title: title })}
        </FixedSizeList>
      </Card>
    );
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      {init ? (
        <Spinner text={'Loading ...'} color={'primary'} />
      ) : (
        <>
          <Grid item>{customList(t('choices', { ns: [translation] }), left)}</Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center">
              <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleCheckedRight} disabled={leftChecked.length === 0} aria-label="move selected right">
                &gt;
              </Button>
              <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleCheckedLeft} disabled={rightChecked.length === 0} aria-label="move selected left">
                &lt;
              </Button>
            </Grid>
          </Grid>
          <Grid item>{customList(t('selected', { ns: [translation] }), right)}</Grid>
        </>
      )}
    </Grid>
  );
};
