'use client';

import dynamic from 'next/dynamic';
import {Fab} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";

const DynamicMap = dynamic(() => import('./components/map/map'), { ssr: false });

export default function Home() {
    const [isAdding, setIsAdding] = useState(false)

  return <>
      <Fab
          onClick={() => setIsAdding(!isAdding)}
          color={isAdding ? "secondary" : "primary"}
          style={{
          position: 'absolute',
          bottom: "1rem",
          right: "1rem",
      }}>
          <AddIcon />
      </Fab>
      <DynamicMap
          isAdding={isAdding}
      />;
  </>;
}
