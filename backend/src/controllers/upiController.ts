import { Request, Response } from 'express';
import { UpiScannerService } from '../services/upiScanner';
import { logSecurityEvent } from '../utils/auditLogger';

export const checkUpiOrLink = async (req: Request, res: Response) => {
  try {
    const { target } = req.body;

    if (!target || typeof target !== 'string' || target.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid payment link or UPI identifier to analyze.' });
    }

    const result = UpiScannerService.analyze(target);

    logSecurityEvent(
      'UPI_SCAM_CHECK',
      'guest@payguard.io',
      'USER',
      `Checked target "${target.substring(0, 40)}" - Score: ${result.riskScore}/100 [${result.riskLevel}]`
    );

    return res.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Scam scan failed' });
  }
};
