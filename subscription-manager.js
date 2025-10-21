const { app } = require('electron');
const path = require('path');
const fs = require('fs');

class SubscriptionManager {
    constructor() {
        this.subscriptionDataPath = path.join(app.getPath('userData'), 'subscription.json');
        this.trialDays = 7;
        this.monthlyPrice = 499.00;
        this.subscriptionProductId = 'focus_planner_premium_monthly';
        
        // Initialize subscription data
        this.subscriptionData = this.loadSubscriptionData();
    }

    // Load subscription data from file
    loadSubscriptionData() {
        try {
            if (fs.existsSync(this.subscriptionDataPath)) {
                const data = fs.readFileSync(this.subscriptionDataPath, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading subscription data:', error);
        }

        // Default subscription data for new users
        return {
            isSubscribed: false,
            isTrialActive: true,
            trialStartDate: new Date().toISOString(),
            subscriptionStartDate: null,
            subscriptionEndDate: null,
            lastCheckDate: new Date().toISOString()
        };
    }

    // Save subscription data to file
    saveSubscriptionData() {
        try {
            fs.writeFileSync(this.subscriptionDataPath, JSON.stringify(this.subscriptionData, null, 2));
        } catch (error) {
            console.error('Error saving subscription data:', error);
        }
    }

    // Check if trial period is still active
    isTrialActive() {
        if (!this.subscriptionData.isTrialActive) {
            return false;
        }

        const trialStart = new Date(this.subscriptionData.trialStartDate);
        const now = new Date();
        const trialEnd = new Date(trialStart.getTime() + (this.trialDays * 24 * 60 * 60 * 1000));

        return now < trialEnd;
    }

    // Check if user has active subscription
    isSubscribed() {
        if (this.subscriptionData.isSubscribed) {
            // Check if subscription hasn't expired
            if (this.subscriptionData.subscriptionEndDate) {
                const subscriptionEnd = new Date(this.subscriptionData.subscriptionEndDate);
                const now = new Date();
                
                if (now < subscriptionEnd) {
                    return true;
                } else {
                    // Subscription expired
                    this.subscriptionData.isSubscribed = false;
                    this.saveSubscriptionData();
                }
            }
        }
        
        return false;
    }

    // Check if user can use the app (trial or subscription)
    canUseApp() {
        // Allow all users to use the app - show subscription UI within the app
        return true; // this.isTrialActive() || this.isSubscribed();
    }

    // Get days remaining in trial
    getTrialDaysRemaining() {
        if (!this.isTrialActive()) {
            return 0;
        }

        const trialStart = new Date(this.subscriptionData.trialStartDate);
        const now = new Date();
        const trialEnd = new Date(trialStart.getTime() + (this.trialDays * 24 * 60 * 60 * 1000));
        
        const daysRemaining = Math.ceil((trialEnd - now) / (24 * 60 * 60 * 1000));
        return Math.max(0, daysRemaining);
    }

    // Get subscription status for UI
    getSubscriptionStatus() {
        const status = {
            canUseApp: this.canUseApp(),
            isTrialActive: this.isTrialActive(),
            isSubscribed: this.isSubscribed(),
            trialDaysRemaining: this.getTrialDaysRemaining(),
            monthlyPrice: this.monthlyPrice,
            subscriptionProductId: this.subscriptionProductId
        };

        if (this.isTrialActive()) {
            status.message = `Free trial: ${this.getTrialDaysRemaining()} days remaining`;
            status.statusType = 'trial';
        } else if (this.isSubscribed()) {
            status.message = 'Premium subscription active';
            status.statusType = 'subscribed';
        } else {
            status.message = 'Trial expired - Subscribe to continue';
            status.statusType = 'expired';
        }

        return status;
    }

    // Simulate successful subscription purchase
    activateSubscription() {
        const now = new Date();
        const subscriptionEnd = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now

        this.subscriptionData.isSubscribed = true;
        this.subscriptionData.isTrialActive = false;
        this.subscriptionData.subscriptionStartDate = now.toISOString();
        this.subscriptionData.subscriptionEndDate = subscriptionEnd.toISOString();
        this.subscriptionData.lastCheckDate = now.toISOString();

        this.saveSubscriptionData();
        
        console.log('Subscription activated successfully');
        return true;
    }

    // Handle Microsoft Store purchase (placeholder - needs actual Store API integration)
    async purchaseSubscription() {
        try {
            // In a real implementation, this would integrate with Microsoft Store Services
            // For now, we'll simulate the purchase process
            
            console.log('Initiating Microsoft Store purchase...');
            console.log(`Product ID: ${this.subscriptionProductId}`);
            console.log(`Price: $${this.monthlyPrice}/month`);
            
            // Simulate purchase success (in real app, this would come from Store API)
            const purchaseSuccess = await this.simulateStorePurchase();
            
            if (purchaseSuccess) {
                this.activateSubscription();
                return { success: true, message: 'Subscription purchased successfully!' };
            } else {
                return { success: false, message: 'Purchase failed. Please try again.' };
            }
        } catch (error) {
            console.error('Purchase error:', error);
            return { success: false, message: 'Purchase error occurred. Please try again.' };
        }
    }

    // Simulate Microsoft Store purchase process
    async simulateStorePurchase() {
        // This is a placeholder for the actual Microsoft Store Services integration
        // In a real implementation, you would use the Windows Store Services SDK
        
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                // For demo purposes, simulate successful purchase
                // In production, this would be handled by actual Store API
                resolve(true);
            }, 2000);
        });
    }

    // Open Microsoft Store to subscription page
    openStoreSubscriptionPage() {
        const { shell } = require('electron');
        
        // This would open the actual Microsoft Store subscription page
        // For now, we'll simulate opening a subscription page
        const storeUrl = `ms-windows-store://pdp/?productid=${this.subscriptionProductId}`;
        
        shell.openExternal(storeUrl).catch(err => {
            console.error('Error opening Store:', err);
        });
    }

    // Check subscription status periodically
    startSubscriptionMonitoring() {
        // Check subscription status every hour
        setInterval(() => {
            this.checkSubscriptionStatus();
        }, 60 * 60 * 1000); // 1 hour
    }

    // Check and update subscription status
    checkSubscriptionStatus() {
        const previousStatus = this.subscriptionData.isSubscribed;
        
        // Update last check date
        this.subscriptionData.lastCheckDate = new Date().toISOString();
        
        // Re-evaluate subscription status
        const currentStatus = this.isSubscribed();
        
        if (previousStatus !== currentStatus) {
            console.log(`Subscription status changed: ${previousStatus} -> ${currentStatus}`);
            this.saveSubscriptionData();
            
            // Emit event for UI to update
            if (this.onStatusChange) {
                this.onStatusChange(this.getSubscriptionStatus());
            }
        }
    }
}

module.exports = SubscriptionManager;
