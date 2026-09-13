# Evia3.0

Evia is the learner-side companion in the Nisia suite.

## Avatar parity

The Evia3.0 avatar is implemented from the current visible avatar treatment used by `DDRNFinch/Milos`: the same circular body proportions, OO eye proportions, gaze system, blink timing, float, glow, wobble, squish and lean behaviour. Milos currently documents that its interface is built around Evia's quiet avatar-led experience, and its current avatar implementation uses the visible Evia structure with only the visual hue changed for Milos. Evia3.0 restores that structure in Evia's yellow treatment.

The source parity was taken from Milos' current `milos-evia-avatar-v276.css` and `milos-evia-avatar-v276.js` implementation.

## Direction

This repository is intentionally a clean Evia3.0 foundation. The learner workflow will be built around:

- simple avatar-led navigation
- course duties rather than separate KSB checklists
- evidence captured against practical duties
- live KSB completion state
- already-met KSBs automatically excluded from future learner tasks
- rejected evidence returning a KSB to top-up/required state
- offline-first evidence capture
- Nisia course synchronisation

The learner should never have to understand the underlying mapping engine.
