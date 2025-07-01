'use client';

import React from 'react';
import { ResignationLogic } from './resignationLogic';

export default function ResignationPage() {
  // Initialize the logic (this ensures the hook is called properly)
  ResignationLogic();

  return (
    <div>
      <h1>Resignation Requests</h1>
      <p>This page is under construction. Logic is loaded successfully.</p>
      {/* TODO: Implement the full UI using the logic */}
    </div>
  );
}
