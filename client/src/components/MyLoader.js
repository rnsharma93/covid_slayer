import React, { Component } from "react";
import ContentLoader from "react-content-loader";

export const MyLoader = () => (
  <ContentLoader>
    <rect x="0" y="0" rx="4" ry="4" width="100%" height="20" />
    <rect x="0" y="30" rx="3" ry="3" width="100%" height="20" />
    <rect x="0" y="60" rx="3" ry="3" width="100%" height="20" />
	<rect x="0" y="90" rx="3" ry="3" width="100%" height="20" />
  </ContentLoader>
);