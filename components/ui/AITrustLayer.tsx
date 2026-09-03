import React, { useState } from 'react';
import { Sparkles, Check, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AITrustLayerProps {
  label: string;
  value: string;
  confidence: 'High' | 'Medium' | 'Low';
  source: 'Prescription OCR' | 'Voice Note' | 'Clinical Note' | 'AI Triage';
  onConfirm?: (val: string) => void;
  onReject?: () => void;
  onEdit?: (newVal: string) => void;
}

export function AITrustLayer({
  label,
  value,
  confidence,
  source,
  onConfirm,
  onReject,
  onEdit
}: AITrustLayerProps) {
  const [status, setStatus] = useState<'PENDING' | 'CONFIRMED' | 'REJECTED' | 'EDITED'>('PENDING');
  const [currentValue, setCurrentValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  const handleConfirm = () => {
    setStatus('CONFIRMED');
    if (onConfirm) onConfirm(currentValue);
  };

  const handleReject = () => {
    setStatus('REJECTED');
    if (onReject) onReject();
  };

  const handleEditSave = () => {
    setStatus('EDITED');
    setIsEditing(false);
    if (onEdit) onEdit(currentValue);
  };

  return (
    <div className={cn(
      "border rounded-xl p-4 transition-all",
      status === 'PENDING' ? "bg-slate-50 border-indigo-100" :
      status === 'CONFIRMED' ? "bg-emerald-50/50 border-emerald-200" :
      status === 'REJECTED' ? "bg-slate-50 border-slate-200 opacity-60" :
      "bg-amber-50/50 border-amber-200"
    )}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className={cn(
            "w-4 h-4",
            confidence === 'High' ? 'text-indigo-500' :
            confidence === 'Medium' ? 'text-amber-500' : 'text-rose-500'
          )} />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {source}
          </span>
          <Badge variant="outline" className={cn(
            "text-[9px] px-1.5 py-0",
            confidence === 'High' ? 'bg-indigo-50 text-indigo-700' :
            confidence === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
          )}>
            {confidence} Confidence
          </Badge>
          
          {confidence === 'Low' && (
            <span className="flex items-center gap-1 text-[10px] text-rose-600 font-medium ml-2">
              <AlertTriangle className="w-3 h-3" />
              Human Review Required
            </span>
          )}
        </div>

        {status !== 'PENDING' && (
          <Badge variant="outline" className={cn(
            "text-[10px]",
            status === 'CONFIRMED' ? "bg-emerald-100 text-emerald-800" :
            status === 'EDITED' ? "bg-amber-100 text-amber-800" :
            "bg-slate-200 text-slate-600"
          )}>
            {status}
          </Badge>
        )}
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
        {isEditing ? (
          <input 
            type="text"
            className="w-full text-sm font-semibold p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            autoFocus
          />
        ) : (
          <div className={cn(
            "text-base font-semibold",
            status === 'REJECTED' ? 'line-through text-slate-400' : 'text-slate-900'
          )}>
            {currentValue}
          </div>
        )}
      </div>

      {status === 'PENDING' && !isEditing && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200/60">
          <Button size="sm" onClick={handleConfirm} className="bg-indigo-600 hover:bg-indigo-700 h-7 text-xs px-3">
            <Check className="w-3 h-3 mr-1" /> Confirm
          </Button>
          <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="h-7 text-xs px-3">
            Edit
          </Button>
          <Button size="sm" variant="ghost" onClick={handleReject} className="h-7 text-xs px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50">
            <X className="w-3 h-3 mr-1" /> Reject
          </Button>
        </div>
      )}

      {isEditing && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200/60">
          <Button size="sm" onClick={handleEditSave} className="bg-indigo-600 hover:bg-indigo-700 h-7 text-xs px-3">
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setIsEditing(false); setCurrentValue(value); }} className="h-7 text-xs px-3">
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
