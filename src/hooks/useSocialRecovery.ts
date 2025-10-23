'use client';

import { useState, useCallback } from 'react';
import { useBiconomy } from '@/components/BiconomyProvider';
import { useToast } from '@/components/ui/Toast';

interface Guardian {
  address: `0x${string}`;
  name: string;
  email?: string;
  isActive: boolean;
}

interface RecoveryRequest {
  newOwner: `0x${string}`;
  guardianSignatures: `0x${string}`[];
  initiatedAt: number;
  expiresAt: number;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
}

export function useSocialRecovery() {
  const { smartAccount } = useBiconomy();
  const { showToast } = useToast();
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [recoveryRequests, setRecoveryRequests] = useState<RecoveryRequest[]>([]);

  const setupRecovery = useCallback(async (
    guardianAddresses: `0x${string}`[],
    guardianNames: string[],
    threshold: number,
    recoveryDelay: number = 86400 * 3 // 3 days default
  ) => {
    if (!smartAccount) {
      showToast('Smart account not initialized', 'error');
      return false;
    }

    if (guardianAddresses.length < 2) {
      showToast('At least 2 guardians required', 'error');
      return false;
    }

    if (threshold < 2 || threshold > guardianAddresses.length) {
      showToast('Threshold must be between 2 and number of guardians', 'error');
      return false;
    }

    setIsSettingUp(true);
    try {
      // Create social recovery module
      const socialRecoveryModule = await smartAccount.createModule({
        type: 'SocialRecovery',
        guardians: guardianAddresses,
        threshold,
        recoveryDelay
      });

      // Enable the module
      await smartAccount.enableModule(socialRecoveryModule);

      // Update local state
      const newGuardians: Guardian[] = guardianAddresses.map((address, index) => ({
        address,
        name: guardianNames[index] || `Guardian ${index + 1}`,
        isActive: true
      }));
      setGuardians(newGuardians);

      // Store in localStorage
      localStorage.setItem('social_recovery_guardians', JSON.stringify(newGuardians));
      localStorage.setItem('social_recovery_threshold', threshold.toString());
      localStorage.setItem('social_recovery_delay', recoveryDelay.toString());

      showToast('Social recovery setup completed successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error setting up social recovery:', error);
      showToast('Failed to setup social recovery', 'error');
      return false;
    } finally {
      setIsSettingUp(false);
    }
  }, [smartAccount, showToast]);

  const initiateRecovery = useCallback(async (
    newOwner: `0x${string}`
  ) => {
    if (!smartAccount) {
      showToast('Smart account not initialized', 'error');
      return false;
    }

    const storedGuardians = localStorage.getItem('social_recovery_guardians');
    if (!storedGuardians) {
      showToast('No guardians found. Please setup social recovery first.', 'error');
      return false;
    }

    const threshold = parseInt(localStorage.getItem('social_recovery_threshold') || '2');
    const delay = parseInt(localStorage.getItem('social_recovery_delay') || '259200'); // 3 days

    try {
      // Create recovery request
      const recoveryRequest: RecoveryRequest = {
        newOwner,
        guardianSignatures: [],
        initiatedAt: Math.floor(Date.now() / 1000),
        expiresAt: Math.floor(Date.now() / 1000) + delay,
        status: 'pending'
      };

      // Store recovery request
      const requests = JSON.parse(localStorage.getItem('recovery_requests') || '[]');
      requests.push(recoveryRequest);
      localStorage.setItem('recovery_requests', JSON.stringify(requests));
      setRecoveryRequests(requests);

      // Notify guardians (in a real app, this would send emails/push notifications)
      showToast(`Recovery initiated. ${threshold} guardians must approve within ${delay / 86400} days.`, 'success');
      
      return true;
    } catch (error) {
      console.error('Error initiating recovery:', error);
      showToast('Failed to initiate recovery', 'error');
      return false;
    }
  }, [smartAccount, showToast]);

  const approveRecovery = useCallback(async (
    recoveryRequestId: number,
    guardianSignature: `0x${string}`
  ) => {
    if (!smartAccount) {
      showToast('Smart account not initialized', 'error');
      return false;
    }

    try {
      const requests = JSON.parse(localStorage.getItem('recovery_requests') || '[]');
      const request = requests[recoveryRequestId];
      
      if (!request) {
        showToast('Recovery request not found', 'error');
        return false;
      }

      if (request.status !== 'pending') {
        showToast('Recovery request is no longer pending', 'error');
        return false;
      }

      if (request.expiresAt < Math.floor(Date.now() / 1000)) {
        showToast('Recovery request has expired', 'error');
        return false;
      }

      // Add guardian signature
      request.guardianSignatures.push(guardianSignature);
      
      const threshold = parseInt(localStorage.getItem('social_recovery_threshold') || '2');
      
      if (request.guardianSignatures.length >= threshold) {
        // Execute recovery
        await smartAccount.executeRecovery(
          request.newOwner,
          request.guardianSignatures
        );
        
        request.status = 'approved';
        showToast('Account recovery completed successfully!', 'success');
      } else {
        showToast(`Recovery approved. ${threshold - request.guardianSignatures.length} more approvals needed.`, 'success');
      }

      // Update stored requests
      localStorage.setItem('recovery_requests', JSON.stringify(requests));
      setRecoveryRequests(requests);
      
      return true;
    } catch (error) {
      console.error('Error approving recovery:', error);
      showToast('Failed to approve recovery', 'error');
      return false;
    }
  }, [smartAccount, showToast]);

  const rejectRecovery = useCallback(async (recoveryRequestId: number) => {
    try {
      const requests = JSON.parse(localStorage.getItem('recovery_requests') || '[]');
      const request = requests[recoveryRequestId];
      
      if (!request) {
        showToast('Recovery request not found', 'error');
        return false;
      }

      request.status = 'rejected';
      localStorage.setItem('recovery_requests', JSON.stringify(requests));
      setRecoveryRequests(requests);
      
      showToast('Recovery request rejected', 'success');
      return true;
    } catch (error) {
      console.error('Error rejecting recovery:', error);
      showToast('Failed to reject recovery', 'error');
      return false;
    }
  }, [showToast]);

  const loadRecoveryData = useCallback(() => {
    try {
      const storedGuardians = localStorage.getItem('social_recovery_guardians');
      if (storedGuardians) {
        setGuardians(JSON.parse(storedGuardians));
      }

      const storedRequests = localStorage.getItem('recovery_requests');
      if (storedRequests) {
        setRecoveryRequests(JSON.parse(storedRequests));
      }
    } catch (error) {
      console.error('Error loading recovery data:', error);
    }
  }, []);

  const removeGuardian = useCallback(async (guardianAddress: `0x${string}`) => {
    if (!smartAccount) {
      showToast('Smart account not initialized', 'error');
      return false;
    }

    try {
      await smartAccount.removeGuardian(guardianAddress);
      
      const updatedGuardians = guardians.filter(g => g.address !== guardianAddress);
      setGuardians(updatedGuardians);
      localStorage.setItem('social_recovery_guardians', JSON.stringify(updatedGuardians));
      
      showToast('Guardian removed successfully', 'success');
      return true;
    } catch (error) {
      console.error('Error removing guardian:', error);
      showToast('Failed to remove guardian', 'error');
      return false;
    }
  }, [smartAccount, showToast, guardians]);

  const addGuardian = useCallback(async (
    guardianAddress: `0x${string}`,
    name: string
  ) => {
    if (!smartAccount) {
      showToast('Smart account not initialized', 'error');
      return false;
    }

    try {
      await smartAccount.addGuardian(guardianAddress);
      
      const newGuardian: Guardian = {
        address: guardianAddress,
        name,
        isActive: true
      };
      
      const updatedGuardians = [...guardians, newGuardian];
      setGuardians(updatedGuardians);
      localStorage.setItem('social_recovery_guardians', JSON.stringify(updatedGuardians));
      
      showToast('Guardian added successfully', 'success');
      return true;
    } catch (error) {
      console.error('Error adding guardian:', error);
      showToast('Failed to add guardian', 'error');
      return false;
    }
  }, [smartAccount, showToast, guardians]);

  return {
    setupRecovery,
    initiateRecovery,
    approveRecovery,
    rejectRecovery,
    removeGuardian,
    addGuardian,
    loadRecoveryData,
    guardians,
    recoveryRequests,
    isSettingUp,
    isRecovering
  };
}
