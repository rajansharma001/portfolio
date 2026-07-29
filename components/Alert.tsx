import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface AlertProps {
  type: 'error' | 'success' | 'warning';
  message: string;
}

export default function Alert({ type, message }: AlertProps) {
  if (!message) return null;

  const icon = 
    type === 'error' ? <AlertCircle size={18} /> :
    type === 'success' ? <CheckCircle size={18} /> :
    <AlertTriangle size={18} />;

  return (
    <div className={`alert alert-${type}`}>
      {icon}
      <div>{message}</div>
    </div>
  );
}
