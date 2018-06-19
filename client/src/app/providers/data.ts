import { Injectable } from '@angular/core';

import { Property } from './../models/property'

@Injectable() 
export class Data {
  propertyData: any; 
  permissions: string[];
  role: string;

  getPropertyOwnerPermissions() {
    return ["createProperty","removeProperty","editProperty","viewProperty","requestAnalysis","viewAnalysis"]
  }

  getTechnicianPermissions() {
    return ["viewProperty","viewAnalysis"]
  }

  getAllPermissions() {
    return ["createProperty","removeProperty","editProperty","viewProperty","requestAnalysis","viewAnalysis"];
  }
}

