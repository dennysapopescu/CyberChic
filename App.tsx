import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Garment, GarmentCategory, LookbookOutfit, MatchVerdict, UserProfile, UserAccount } from './src/types/wardrobe';
import { StorageService, AppSettings, INITIAL_ACCOUNTS } from './src/services/storage';
import { evaluateMatch } from './src/services/matchEngine';
import { findMatchingOutfit } from './src/services/dressMe';
import { SoundEffects } from './src/services/soundEffects';
import { LeopardBackground } from './src/components/retro/LeopardBackground';
import { RetroWindow } from './src/components/retro/RetroWindow';
import { VerdictBanner } from './src/components/retro/VerdictBanner';
import { GarmentCarouselCard } from './src/components/matcher/GarmentCarouselCard';
import { CategoryBar } from './src/components/matcher/CategoryBar';
import { CRTOverlay } from './src/components/retro/CRTOverlay';
import { BrowseModal } from './src/components/wardrobe/BrowseModal';
import { AddGarmentModal } from './src/components/wardrobe/AddGarmentModal';
import { LookbookModal } from './src/components/wardrobe/LookbookModal';
import { GarmentDetailModal } from './src/components/wardrobe/GarmentDetailModal';
import { UserProfileModal } from './src/components/profile/UserProfileModal';
import { LoginModal } from './src/components/auth/LoginModal';

export default function App() {
  const [garments, setGarments] = useState<Garment[]>([]);
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);

  const [savedOutfits, setSavedOutfits] = useState<LookbookOutfit[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ isMuted: false, isCrtEnabled: true });
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [activeUser, setActiveUser] = useState<UserAccount | null>(null);

  // Modals state
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [inspectGarment, setInspectGarment] = useState<Garment | null>(null);

  // Animation state for "DRESS ME"
  const [isSpinning, setIsSpinning] = useState(false);
  const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      const loadedUsers = await StorageService.getUsers();
      setUsers(loadedUsers);

      const active = await StorageService.getActiveUser();
      if (active) {
        setActiveUser(active);
        const loadedGarments = await StorageService.getGarments(active.id);
        setGarments(loadedGarments);
        const loadedLookbook = await StorageService.getLookbook(active.id);
        setSavedOutfits(loadedLookbook);
      } else {
        // Fresh install without accounts: show first-time onboarding wizard!
        setIsLoginOpen(true);
        const previewGarments = await StorageService.getGarments('guest');
        setGarments(previewGarments);
      }

      const loadedSettings = await StorageService.getSettings();
      setSettings(loadedSettings);
      SoundEffects.setMuted(loadedSettings.isMuted);
    }
    loadData();

    return () => {
      if (spinTimerRef.current) clearInterval(spinTimerRef.current);
    };
  }, []);

  const tops = garments.filter((g) => g.category === 'top');
  const bottoms = garments.filter((g) => g.category === 'bottom');

  const currentTop = tops[topIndex] || null;
  const currentBottom = bottoms[bottomIndex] || null;

  // Real-time fashion match verdict
  const currentVerdict: MatchVerdict =
    currentTop && currentBottom
      ? evaluateMatch(currentTop, currentBottom)
      : {
          status: 'MISMATCH',
          score: 0,
          title: 'STANDBY',
          quote: 'Select top and bottom to evaluate ensemble!',
          explanation: 'Ready to calculate fashion synergy.',
        };

  // Sound feedback on manual carousel change
  const playVerdictSound = (verdict: MatchVerdict) => {
    if (verdict.status === 'MATCH') {
      SoundEffects.play('match');
    } else {
      SoundEffects.play('mismatch');
    }
  };

  // Navigation handlers: Tops
  const handlePrevTop = () => {
    if (tops.length === 0 || isSpinning) return;
    const nextIdx = (topIndex - 1 + tops.length) % tops.length;
    setTopIndex(nextIdx);
    const newVerdict = evaluateMatch(tops[nextIdx], currentBottom);
    playVerdictSound(newVerdict);
  };

  const handleNextTop = () => {
    if (tops.length === 0 || isSpinning) return;
    const nextIdx = (topIndex + 1) % tops.length;
    setTopIndex(nextIdx);
    const newVerdict = evaluateMatch(tops[nextIdx], currentBottom);
    playVerdictSound(newVerdict);
  };

  // Navigation handlers: Bottoms
  const handlePrevBottom = () => {
    if (bottoms.length === 0 || isSpinning) return;
    const nextIdx = (bottomIndex - 1 + bottoms.length) % bottoms.length;
    setBottomIndex(nextIdx);
    const newVerdict = evaluateMatch(currentTop, bottoms[nextIdx]);
    playVerdictSound(newVerdict);
  };

  const handleNextBottom = () => {
    if (bottoms.length === 0 || isSpinning) return;
    const nextIdx = (bottomIndex + 1) % bottoms.length;
    setBottomIndex(nextIdx);
    const newVerdict = evaluateMatch(currentTop, bottoms[nextIdx]);
    playVerdictSound(newVerdict);
  };

  // "DRESS ME" Slot Machine Engine
  const handleDressMe = () => {
    if (isSpinning || tops.length === 0 || bottoms.length === 0) return;

    setIsSpinning(true);
    const targetMatch = findMatchingOutfit(tops, bottoms);

    let step = 0;
    const totalSteps = 22;
    let delay = 60;

    const runStep = () => {
      step++;
      setTopIndex((prev) => (prev + 1) % tops.length);
      setBottomIndex((prev) => (prev + 1) % bottoms.length);
      SoundEffects.play('tick');

      if (step < totalSteps) {
        // Accelerate then decelerate
        if (step > totalSteps - 6) {
          delay += 40;
        }
        spinTimerRef.current = setTimeout(runStep, delay);
      } else {
        // Land on the matching target
        if (targetMatch) {
          setTopIndex(targetMatch.topIndex);
          setBottomIndex(targetMatch.bottomIndex);
        }
        setIsSpinning(false);
        setTimeout(() => {
          SoundEffects.play('match');
        }, 120);
      }
    };

    spinTimerRef.current = setTimeout(runStep, delay);
  };

  // Direct selection from Browse modal
  const handleSelectFromBrowse = (garment: Garment) => {
    if (garment.category === 'top') {
      const idx = tops.findIndex((g) => g.id === garment.id);
      if (idx !== -1) setTopIndex(idx);
    } else if (garment.category === 'bottom') {
      const idx = bottoms.findIndex((g) => g.id === garment.id);
      if (idx !== -1) setBottomIndex(idx);
    }
  };

  // Add custom garment
  const handleSaveNewGarment = async (newGarment: Garment) => {
    const userId = activeUser ? activeUser.id : 'guest';
    const updated = await StorageService.saveGarment(newGarment, userId);
    setGarments(updated);
    if (newGarment.category === 'top') {
      setTopIndex(0);
    } else if (newGarment.category === 'bottom') {
      setBottomIndex(0);
    }
  };

  // Delete garment
  const handleDeleteGarment = async (id: string) => {
    const userId = activeUser ? activeUser.id : 'guest';
    const updated = await StorageService.deleteGarment(id, userId);
    setGarments(updated);
    setTopIndex(0);
    setBottomIndex(0);
  };

  // Reset to starter pack
  const handleResetWardrobe = async () => {
    const userId = activeUser ? activeUser.id : 'guest';
    const reset = await StorageService.resetToStarterPack(userId);
    setGarments(reset);
    setTopIndex(0);
    setBottomIndex(0);
  };

  // Lookbook actions
  const handleSaveCurrentLook = async (name: string) => {
    if (!currentTop || !currentBottom) return;
    const userId = activeUser ? activeUser.id : 'guest';

    const newOutfit: LookbookOutfit = {
      id: `look-${Date.now()}`,
      name,
      top: currentTop,
      bottom: currentBottom,
      score: currentVerdict.score,
      verdictTitle: currentVerdict.title,
      quote: currentVerdict.quote,
      createdAt: Date.now(),
    };

    const updated = await StorageService.saveOutfitToLookbook(newOutfit, userId);
    setSavedOutfits(updated);
  };

  const handleEquipOutfit = (outfit: LookbookOutfit) => {
    const tIdx = tops.findIndex((g) => g.id === outfit.top.id);
    const bIdx = bottoms.findIndex((g) => g.id === outfit.bottom.id);
    if (tIdx !== -1) setTopIndex(tIdx);
    if (bIdx !== -1) setBottomIndex(bIdx);
  };

  const handleDeleteOutfit = async (id: string) => {
    const userId = activeUser ? activeUser.id : 'guest';
    const updated = await StorageService.deleteOutfitFromLookbook(id, userId);
    setSavedOutfits(updated);
  };

  // User account switching handlers
  const handleSelectUser = async (userId: string) => {
    const selected = await StorageService.setActiveUser(userId);
    setActiveUser(selected);
    const userGarments = await StorageService.getGarments(selected.id);
    setGarments(userGarments);
    setTopIndex(0);
    setBottomIndex(0);
    const userLookbook = await StorageService.getLookbook(selected.id);
    setSavedOutfits(userLookbook);
  };

  const handleCreateUser = async (
    name: string,
    tagline?: string,
    avatarIcon?: string,
    email?: string,
    authProvider: 'local' | 'google' = 'local',
    avatarImageUri?: string
  ) => {
    const created = await StorageService.createUser(
      name,
      tagline,
      avatarIcon,
      email,
      authProvider,
      avatarImageUri
    );
    const updatedUsers = await StorageService.getUsers();
    setUsers(updatedUsers);
    setActiveUser(created);
    const userGarments = await StorageService.getGarments(created.id);
    setGarments(userGarments);
    setTopIndex(0);
    setBottomIndex(0);
    const userLookbook = await StorageService.getLookbook(created.id);
    setSavedOutfits(userLookbook);
  };

  const handleDeleteUser = async (userId: string) => {
    const remaining = await StorageService.deleteUser(userId);
    setUsers(remaining);
    const active = await StorageService.getActiveUser();
    setActiveUser(active);
    if (active) {
      const userGarments = await StorageService.getGarments(active.id);
      setGarments(userGarments);
      const userLookbook = await StorageService.getLookbook(active.id);
      setSavedOutfits(userLookbook);
    } else {
      setIsLoginOpen(true);
      const preview = await StorageService.getGarments('guest');
      setGarments(preview);
      setSavedOutfits([]);
    }
  };

  const handleSaveProfile = async (updated: UserProfile) => {
    if (!activeUser) return;
    const updatedAcc: UserAccount = {
      ...activeUser,
      name: updated.name,
      tagline: updated.tagline || activeUser.tagline,
      avatarIcon: updated.avatarIcon || activeUser.avatarIcon,
      avatarImageUri: updated.avatarImageUri !== undefined ? updated.avatarImageUri : activeUser.avatarImageUri,
    };
    const saved = await StorageService.updateUser(updatedAcc);
    setActiveUser(saved);
    const refreshed = await StorageService.getUsers();
    setUsers(refreshed);
  };

  // Audio and CRT toggles
  const handleToggleSound = async () => {
    const isMuted = SoundEffects.toggleMute();
    const updated = await StorageService.saveSettings({ isMuted });
    setSettings(updated);
  };

  const handleToggleCrt = async () => {
    const isCrtEnabled = !settings.isCrtEnabled;
    const updated = await StorageService.saveSettings({ isCrtEnabled });
    setSettings(updated);
  };

  const windowHeight = Dimensions.get('window').height;
  const isCompact = windowHeight < 700;

  const currentUserName = activeUser ? activeUser.name : 'GUEST';
  const currentUserAvatar = activeUser ? activeUser.avatarIcon : '👑';

  return (
    <SafeAreaProvider>
      <LeopardBackground>
        <StatusBar barStyle="light-content" backgroundColor="#000080" />
        <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <RetroWindow
            title={activeUser ? `${activeUser.name.toUpperCase()}'S WARDROBE` : "CYBERCHIC 95 WARDROBE"}
            subtitle="[FALL FASHIONS]"
            userAvatar={currentUserAvatar}
            userAvatarImageUri={activeUser?.avatarImageUri}
            userName={currentUserName}
            onOpenProfile={() => {
              if (activeUser) {
                setIsProfileOpen(true);
              } else {
                setIsLoginOpen(true);
              }
            }}
            statusText={
              isSpinning
                ? 'CALCULATING FASHION MATRIX...'
                : activeUser
                ? `${activeUser.name.toUpperCase()}'S COMPUTER: ${currentVerdict.score}% COMPATIBLE`
                : 'WELCOME TO CYBERCHIC 95 — PLEASE LOG IN'
            }
          >
            {/* Retro Verdict Banner (MATCH! vs MIS-MATCH!) */}
            <VerdictBanner verdict={currentVerdict} />

            {/* Dual Synchronized Carousels */}
            <GarmentCarouselCard
              label="Tops & Blouses"
              garments={tops}
              currentIndex={topIndex}
              onPrev={handlePrevTop}
              onNext={handleNextTop}
              onSelectDetails={(g) => setInspectGarment(g)}
              height={isCompact ? 160 : 185}
            />

            <GarmentCarouselCard
              label="Skirts & Pants"
              garments={bottoms}
              currentIndex={bottomIndex}
              onPrev={handlePrevBottom}
              onNext={handleNextBottom}
              onSelectDetails={(g) => setInspectGarment(g)}
              height={isCompact ? 160 : 185}
            />

            {/* Bottom Category Bar & Action Buttons */}
            <CategoryBar
              userName={currentUserName}
              onOpenProfile={() => {
                if (activeUser) {
                  setIsProfileOpen(true);
                } else {
                  setIsLoginOpen(true);
                }
              }}
              onSelectCategoryFilter={(cat) => {
                setIsBrowseOpen(true);
              }}
              onOpenBrowse={() => setIsBrowseOpen(true)}
              onDressMe={handleDressMe}
              onOpenLookbook={() => setIsLookbookOpen(true)}
              isSpinning={isSpinning}
              isMuted={settings.isMuted}
              onToggleSound={handleToggleSound}
              isCrtEnabled={settings.isCrtEnabled}
              onToggleCrt={handleToggleCrt}
            />
          </RetroWindow>
        </ScrollView>
      </SafeAreaView>

      {/* Retro CRT Scanline & Glass Overlay */}
      <CRTOverlay enabled={settings.isCrtEnabled} />

      {/* User Login & Switcher Modal */}
      <LoginModal
        visible={isLoginOpen}
        users={users}
        activeUserId={activeUser ? activeUser.id : ''}
        canClose={!!activeUser}
        onClose={() => setIsLoginOpen(false)}
        onSelectUser={handleSelectUser}
        onCreateUser={handleCreateUser}
        onDeleteUser={handleDeleteUser}
      />

      {/* User Profile & Identity Modal */}
      {activeUser && (
        <UserProfileModal
          visible={isProfileOpen}
          profile={activeUser}
          onClose={() => setIsProfileOpen(false)}
          onSave={handleSaveProfile}
          onSwitchUserAccount={() => setIsLoginOpen(true)}
        />
      )}

      {/* Wardrobe Browser Modal */}
      <BrowseModal
        visible={isBrowseOpen}
        userName={currentUserName}
        garments={garments}
        onClose={() => setIsBrowseOpen(false)}
        onSelectGarment={handleSelectFromBrowse}
        onOpenAddModal={() => {
          setIsBrowseOpen(false);
          setIsAddOpen(true);
        }}
        onDeleteGarment={handleDeleteGarment}
        onResetWardrobe={handleResetWardrobe}
      />

      {/* Add Garment Modal */}
      <AddGarmentModal
        visible={isAddOpen}
        userName={currentUserName}
        onClose={() => setIsAddOpen(false)}
        onSave={handleSaveNewGarment}
      />

      {/* Lookbook Modal */}
      <LookbookModal
        visible={isLookbookOpen}
        userName={currentUserName}
        currentTop={currentTop!}
        currentBottom={currentBottom!}
        currentVerdict={currentVerdict}
        savedOutfits={savedOutfits}
        onClose={() => setIsLookbookOpen(false)}
        onSaveCurrentLook={handleSaveCurrentLook}
        onEquipOutfit={handleEquipOutfit}
        onDeleteOutfit={handleDeleteOutfit}
      />

      {/* Garment Details Modal */}
      <GarmentDetailModal
        visible={!!inspectGarment}
        garment={inspectGarment}
        onClose={() => setInspectGarment(null)}
      />
    </LeopardBackground>
  </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'web' ? 20 : 10,
    paddingHorizontal: 8,
  },
});
