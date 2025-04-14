"use client";

import React from "react";
import { Container } from "./container";

export function Footer(): React.ReactElement {
  return (
    <footer className="border-t-secondary-100 mt-auto w-full border-t py-5">
      <Container className="flex items-center justify-center gap-3">
        <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
      </Container>
    </footer>
  );
}
