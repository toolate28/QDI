#!/usr/bin/env bun
/**
 * SpiralSafe MCP Server
 *
 * Exposes coherence, provenance, and optimization tools via MCP protocol.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { analyzeWave, calculateChaosScore, PHI, FIBONACCI } from '@spiralsafe/wave-toolkit';
import {
  createDecision,
  validateGate,
  createTrailEntry,
  generateAtomTag,
  isTransitionReady
} from '@spiralsafe/atom-trail';
import type { AtomType, Gate, Phase } from '@spiralsafe/atom-trail';

// Create MCP server
const server = new Server(
  { name: 'spiralsafe', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'analyze_wave',
      description: 'Analyze text for coherence metrics (curl, divergence, potential)',
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'Text to analyze' }
        },
        required: ['text']
      }
    },
    {
      name: 'track_atom',
      description: 'Create an ATOM decision record for provenance tracking',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['INIT', 'DOC', 'ENHANCE', 'FIX', 'VERIFY', 'COMPLETE', 'KENL', 'EDIT'],
            description: 'Type of ATOM decision'
          },
          description: { type: 'string', description: 'What was decided/done' },
          files: { type: 'array', items: { type: 'string' }, description: 'Related files' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Tags for categorization' }
        },
        required: ['type', 'description']
      }
    },
    {
      name: 'validate_gate',
      description: 'Validate a phase gate transition (KENL→AWI→ATOM→SAIF)',
      inputSchema: {
        type: 'object',
        properties: {
          gate: {
            type: 'string',
            enum: ['kenl-to-awi', 'awi-to-atom', 'atom-to-saif', 'saif-to-spiral'],
            description: 'Gate to validate'
          },
          context: { type: 'object', description: 'Context for validation' }
        },
        required: ['gate', 'context']
      }
    },
    {
      name: 'chaos_score',
      description: 'Calculate chaos/fibonacci score from coherence metrics',
      inputSchema: {
        type: 'object',
        properties: {
          curl: { type: 'number', description: 'Curl metric (0-1)' },
          divergence: { type: 'number', description: 'Divergence metric (0-1)' },
          potential: { type: 'number', description: 'Potential metric (0-1)' },
          entropy: { type: 'number', description: 'Entropy metric (0-1)' }
        },
        required: ['curl', 'divergence', 'potential']
      }
    },
    {
      name: 'generate_atom_tag',
      description: 'Generate a new ATOM tag without creating a full decision',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['INIT', 'DOC', 'ENHANCE', 'FIX', 'VERIFY', 'COMPLETE', 'KENL', 'EDIT']
          },
          description: { type: 'string' }
        },
        required: ['type', 'description']
      }
    }
  ]
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'analyze_wave': {
      const result = analyzeWave(args.text as string);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    case 'track_atom': {
      const decision = createDecision(
        args.type as AtomType,
        args.description as string,
        args.files as string[] | undefined,
        args.tags as string[] | undefined
      );
      const entry = createTrailEntry(decision);
      return { content: [{ type: 'text', text: JSON.stringify(entry, null, 2) }] };
    }

    case 'validate_gate': {
      const result = validateGate(args.gate as Gate, args.context);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    case 'chaos_score': {
      const score = calculateChaosScore({
        curl: args.curl as number,
        divergence: args.divergence as number,
        potential: args.potential as number,
        entropy: args.entropy as number || 0.5
      });
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            chaos_score: score,
            phi: PHI,
            fibonacci_used: FIBONACCI[Math.min(Math.floor((args.potential as number) * 10), 11)]
          }, null, 2)
        }]
      };
    }

    case 'generate_atom_tag': {
      const tag = generateAtomTag(args.type as AtomType, args.description as string);
      return { content: [{ type: 'text', text: tag }] };
    }

    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('SpiralSafe MCP server running');
}

main().catch(console.error);
