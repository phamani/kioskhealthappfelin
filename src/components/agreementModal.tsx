/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AgreementModal: React.FC<AgreementModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto print:shadow-none print:border-none bg-white">
        <DialogHeader className="mb-3">
          <h3 className="text-2xl font-bold uppercase text-center">
            Carevision Confidentiality & Non-Disclosure Notice
          </h3>
        </DialogHeader>

        <div className="space-y-6 text-gray-700 text-[16px]">
          <div>
            <strong>1. Confidential & Proprietary:</strong>
            <p className="mt-2">
              All content, design, software, features, workflow, and technology
              of this demo are the exclusive intellectual property and trade
              secrets of Carevision. The entire solution is confidential and
              protected.
            </p>
          </div>

          <div>
            <strong>2. Strict Prohibitions:</strong>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                You may not take any photos, videos, or screen recordings of the
                demo.
              </li>
              <li>
                You may not copy, store, share, or transmit any part of the
                solution or user experience.
              </li>
              <li>
                You may not build or attempt to build any product or solution
                based on this experience, even if modified.
              </li>
            </ul>
          </div>

          <div>
            <strong>3. No Derivative Use:</strong>
            <p className="mt-2">
             Any effort to create,
            support, or contribute to the development of a competing or similar
            solution—directly or indirectly—based on any idea, flow, feature, or
            element of this demo is strictly forbidden.
            </p>
          </div>

          <div>
            <strong>4. No Reverse Engineering:</strong>
            <p className="mt-2">
             You may not decompile,
            disassemble, reverse engineer, analyze, or extract functionality or
            architecture from this demo in any form.
            </p>
          </div>

          <div>
            <strong>5. Non-Disclosure:</strong> 
            <p className="mt-2">
            You may not disclose, discuss,
            or share any information about the Carevision solution with any
            third party, including your organization, partners, or
            collaborators.
            </p>
          </div>

          <div>
            <strong>6. Legal Enforcement:</strong>
            <p className="mt-2">
             Any violation will be treated
            as unauthorized use and misappropriation of trade secrets, and may
            result in immediate legal action, including injunctive relief and
            claims for damages.
            </p>
          </div>

          <div className="text-center text-sm text-black mt-8">
            This is a confidential demonstration. Unauthorized use or
            replication is strictly prohibited.
          </div>
        </div>
        <DialogFooter className="mt-6"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgreementModal;
